import BaseContentGenerator from './BaseContentGenerator'

class IncrementalGenerator extends BaseContentGenerator {
  constructor(config, fileSystem) {
    super(config, fileSystem)
  }

  process(params) {
    return this.readSyncToken()
      .then(syncToken => Promise.all([
        this.contentful.sync({ initial: !syncToken, nextSyncToken: syncToken }),
        this.resolveVariables(),
        { initial: !syncToken, nextSyncToken: syncToken } ]))
      .then(([ data, variables, config ]) => config.initial ? { data, variables } : this.retreiveEntries({ data, variables }))
      .then(res => this.handleUpdates({ ...res }))
      .then(res => this.storeSyncToken(res.nextSyncToken))
  }

  retreiveEntries(res) {
    const params = {
      'sys.id[in]': res.data.entries.map(item => item.sys.id).join(','),
      'include': 2
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
