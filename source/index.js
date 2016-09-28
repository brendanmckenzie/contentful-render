import contentful from 'contentful'

const exports = {
  Router: require('./lib/Router').default,
  Renderer: require('./lib/Renderer').default,
  Model: require('./lib/Model').default,
  FullSiteGenerator: require('./lib/generators/FullSiteGenerator').default,
  LocalFileSystem: require('./lib/filesystems/LocalFileSystem').default,
}

const main = () => {
  const config = {
    contentful: {
      apiKey: 'bed27f1238b89efd12ca24b1c87d5e8ec94161dda3cc7da4ed1b55d007e479ab',
      space: 'oadra9jx0s9q'
    },
    contentTypes: {
      'content': {

      }
    }
  }

  const model = new exports.Model(config)
  const fileSystem = new exports.LocalFileSystem(config)
  const contentfulClient = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.apiKey
  })
  const router = new exports.Router(config)
  const renderer = new exports.Renderer(config, model)
  const generator = new exports.FullSiteGenerator(config, fileSystem, contentfulClient, router, renderer)

  generator.process()
}

main()

export default exports
