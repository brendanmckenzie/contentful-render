const exports = {
  FileSystem: require('./lib/FileSystem').default,
  Generator: require('./lib/Generator').default,
  Host: require('./lib/Host').default,
  Model: require('./lib/Model').default,
  Renderer: require('./lib/Renderer').default,
  Router: require('./lib/Router').default,
  fileSystems: {
    S3FileSystem: require('./lib/filesystems/S3FileSystem').default,
    LocalFileSystem: require('./lib/filesystems/LocalFileSystem').default,
  },
  generators: {
    BaseContentGenerator: require('./lib/generators/BaseContentGenerator').default,
    FullSiteGenerator: require('./lib/generators/FullSiteGenerator').default,
    IncrementalGenerator: require('./lib/generators/IncrementalGenerator').default,
    SitemapGenerator: require('./lib/generators/SitemapGenerator').default,
  },
  renderers: {
    BaseRenderer: require('./lib/renderers/BaseRenderer').default,
    EjsRenderer: require('./lib/renderers/EjsRenderer').default,
    ReactRenderer: require('./lib/renderers/ReactRenderer').default,
  },
}

export default exports
