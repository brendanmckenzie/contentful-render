import axios from 'contentful-sdk-core/vendor-node/axios'
import Contentful from 'contentful/dist/contentful'
import Router from '../lib/Router'
import Renderer from '../lib/Renderer'
import Model from '../lib/Model'

const Setup = (config) => {
  const contentful = Contentful(axios, {
    space: config.contentful.space,
    accessToken: config.contentful.apiKey,
    host: config.contentful.host || (config.contentful.preview ? 'preview.contentful.com' : 'cdn.contentful.com')
  })

  const model = new Model(config)
  const router = new Router(config, model, contentful)
  const renderer = new Renderer(config, model, router)

  return { contentful, model, router, renderer }
}

export default Setup
