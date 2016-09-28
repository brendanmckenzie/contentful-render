import BaseGenerator from './BaseGenerator'

class FullSiteGenerator extends BaseGenerator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super(config, fileSystem, contentful, router, renderer)
  }

  process(params) {
    return this.readSyncToken()
      .then(syncToken => this.contentful.sync({ initial: true }))
      .then(res => this.handleUpdates(res))
      .then(() => this.storeSyncToken(res.nextSyncToken), reject)
      .then(resolve)
      .catch(reject)
  }
}

export default FullSiteGenerator
