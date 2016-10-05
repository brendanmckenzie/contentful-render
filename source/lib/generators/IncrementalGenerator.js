import BaseContentGenerator from './BaseContentGenerator'

class IncrementalGenerator extends BaseContentGenerator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super(config, fileSystem, contentful, router, renderer)
  }

  process(params) {
    return this.readSyncToken()
      .then(syncToken => Promise.all([
        this.contentful.sync({ initial: !syncToken, nextSyncToken: syncToken }),
        this.resolveVariables() ]))
      .then(([ data, variables ]) => this.retreiveEntries({ data, variables }))
      .then(res => this.handleUpdates({ ...variables }))
      .then(res => this.storeSyncToken(res.nextSyncToken))
  }

  retreiveEntries(res) {
    const params = {
      'sys.id[in]': res.data.entries.map(item => item.sys.id)
    }
    return this.contentful.getEntries(params)
      .then(getEntriesRes => {
        return {
          data: {
            ...res.data,
            entries: getEntriesRes.items,
          },
          variables: res.variables
        }
      })
  }
}

export default IncrementalGenerator
