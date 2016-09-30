import contentful from 'contentful'
import Router from '../lib/Router'
import Renderer from '../lib/Renderer'
import Model from '../lib/Model'
import FullSiteGenerator from '../lib/generators/FullSiteGenerator'
import LocalFileSystem from '../lib/filesystems/LocalFileSystem'

const main = () => {
  const config = {
    defaultLocale: 'en-US',
    templatePath: './templates',
    outputPath: '_build',
    contentful: {
      apiKey: 'bed27f1238b89efd12ca24b1c87d5e8ec94161dda3cc7da4ed1b55d007e479ab',
      space: 'oadra9jx0s9q'
    },
    contentTypes: {
      'content': {
        canRender: true,
        renderSystem: 'ejs',
        route: '/{{=it.slug}}',
        template: 'content'
      }
    }
  }

  const contentfulClient = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.apiKey
  })

  const model = new Model(config)
  const fileSystem = new LocalFileSystem(config)
  const router = new Router(config, model)
  const renderer = new Renderer(config, model)
  const generator = new FullSiteGenerator(config, fileSystem, contentfulClient, router, renderer)

  generator.process()
    .then(res => console.log('done', res))
    .catch(err => console.error('error', err))
}

main()
