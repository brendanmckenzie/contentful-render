import BaseContentGenerator from './BaseContentGenerator'

class FullSiteGenerator extends BaseContentGenerator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super(config, fileSystem, contentful, router, renderer)
  }

  process(params) {
    return this.contentful.sync({ initial: true })
      .then(res => this.handleUpdates(res))
      .then(res => this.storeSyncToken(res.nextSyncToken))
  }
}

export default FullSiteGenerator
