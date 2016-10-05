import contentful from 'contentful'
import Router from '../lib/Router'
import Renderer from '../lib/Renderer'
import Model from '../lib/Model'

import express from 'express';

const Host = (config) => {
  const contentfulClient = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.apiKey
  })

  const model = new Model(config)
  const router = new Router(config, model, contentfulClient)
  const renderer = new Renderer(config, model, router)

  const app = express()

  if (config.staticPath) {
    app.use(express.static(config.staticPath))
  }

  app.get('/*', (httpReq, httpRes) => {
    console.log('<', httpReq.url)
    router.getContentByUrl(httpReq.url)
      .then(res => renderer.render(res))
      .then(res => res ? httpRes.send(res) : httpRes.status(404).send('Not found'))
      .catch(err => httpRes.send({ error: err, stack: err.stack }))
  })

  app.listen(6088)
  console.log('listening on port 6088')
}

export default Host
