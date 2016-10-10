import BaseContentGenerator from './BaseContentGenerator'

class FullSiteGenerator extends BaseContentGenerator {
  constructor(config, fileSystem) {
    super(config, fileSystem)
  }

  process(params) {
    return Promise.all([
      this.contentful.sync({ initial: true }),
      this.resolveVariables() ])
      .then(([ data, variables ]) => this.handleUpdates({ data, variables }))
      .then(res => this.storeSyncToken(res.nextSyncToken))
  }
}

export default FullSiteGenerator
