import Promise from 'bluebird'
import _ from 'lodash'

import contentful from 'contentful'
import Router from './Router'
import Renderer from './Renderer'
import Model from './Model'

class Generator {
  constructor(config, fileSystem) {
    this.config = config
    this.fileSystem = fileSystem

    this.contentful = contentful.createClient({
      space: config.contentful.space,
      accessToken: config.contentful.apiKey
    })

    this.model = new Model(config)
    this.router = new Router(config, this.model, this.contentful)
    this.renderer = new Renderer(config, this.model)
  }


  process() { }

  resolveVariables() {
    const promises = _(this.config.variables || {})
      .mapValues(ent => ent())
      .value()

    // TODO: ensure that this will return a promise that resolves all 'variables'
    return Promise.all(promises)
  }
}

export default Generator
