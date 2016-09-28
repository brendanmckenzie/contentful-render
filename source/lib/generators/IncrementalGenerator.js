import BaseGenerator from './BaseGenerator'

class IncrementalGenerator extends BaseGenerator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super(config, fileSystem, contentful, router, renderer)
  }

  process(params) {
    return this.readSyncToken()
      .then(syncToken => this.contentful.sync({ initial: !syncToken, nextSyncToken: syncToken }))
      .then(syncRes => {
        const params = {
          'sys.id[in]': syncRes.entries.map(item => item.sys.id)
        }
        return this.contentful.getEntries(params)
          .then(getEntriesRes => {
            return {
              entries: getEntriesRes.items,
              deletedEntries: syncRes.deletedEntries
            }
          })
      })
      .then(res => this.handleUpdates(res))
      .then(() => this.storeSyncToken(res.nextSyncToken), reject)
  }
}

export default IncrementalGenerator
