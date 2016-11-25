import Promise from 'bluebird'
import _ from 'lodash'

import axios from 'contentful-sdk-core/vendor-node/axios';
import Contentful from 'contentful/dist/contentful';
import Router from './Router'
import Renderer from './Renderer'
import Model from './Model'

class Generator {
  constructor(config, fileSystem) {
    this.config = config
    this.fileSystem = fileSystem

    this.contentful = Contentful(axios, {
      space: config.contentful.space,
      accessToken: config.contentful.apiKey,
      host: config.contentful.host || (config.contentful.preview ? 'preview.contentful.com' : 'cdn.contentful.com')
    })

    this.model = new Model(config)
    this.router = new Router(config, this.model, this.contentful)
    this.renderer = new Renderer(config, this.model, this.router)
  }


  process() { }

  resolveVariables() {
    let obj = {}
    // TODO: make this use _.mapKeys
    for (var k in this.config.variables) {
      obj[k] = this.config.variables[k](this.contentful, this.model)
    }
    return Promise.props(obj)
  }
}

export default Generator
