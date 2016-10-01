import contentful from 'contentful'
import Router from '../lib/Router'
import Renderer from '../lib/Renderer'
import Model from '../lib/Model'
import FullSiteGenerator from '../lib/generators/FullSiteGenerator'
import LocalFileSystem from '../lib/filesystems/LocalFileSystem'

import config from './config'

const main = () => {
  const contentfulClient = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.apiKey
  })

  const model = new Model(config)
  const fileSystem = new LocalFileSystem(config)
  const router = new Router(config, model, contentfulClient)
  const renderer = new Renderer(config, model)
  const generator = new FullSiteGenerator(config, fileSystem, contentfulClient, router, renderer)

  generator.process()
    .then(res => console.log('done', res))
    .catch(err => console.error('error', err))
}

main()
