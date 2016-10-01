import contentful from 'contentful'
import Router from '../lib/Router'
import Renderer from '../lib/Renderer'
import Model from '../lib/Model'

import express from 'express';

import config from './config'

const main = () => {
  const contentfulClient = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.apiKey
  })

  const model = new Model(config)
  const router = new Router(config, model, contentfulClient)
  const renderer = new Renderer(config, model)

  const app = express()

  app.get('/*', (httpReq, httpRes) => {
    console.log('<', httpReq.url)
    router.getContentByUrl(httpReq.url)
      .then(res => renderer.render(res))
      .then(res => res ? httpRes.send(res) : httpRes.status(404).send('Not found'))
      .catch(err => httpRes.send(err))
  })

  app.listen(6088)
  console.log('listening on port 6088')
}

main()
