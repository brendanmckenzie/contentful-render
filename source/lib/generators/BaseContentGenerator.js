import Generator from '../Generator'
import Promise from 'bluebird'
import _ from 'lodash'

class BaseContentGenerator extends Generator {
  constructor(config, fileSystem) {
    super(config, fileSystem)
  }

  process(params) { }

  handleUpdates(res) {
    const tasks = [
      ...res.data.entries.map(item => ({ action: 'createOrUpdate', item })),
      // ...res.data.deletedEntries.map(item => ({ action: 'delete', item }))
    ]
    const chunks = _(tasks).chunk(1000).value()
    return Promise.each(chunks, (chunkTasks, i, length) => {
      const promises = chunkTasks.map(ent => this[ent.action](ent.item, res.variables))

      return Promise.all(promises)
    })
    .then(() => res.data)
  }

  createOrUpdate(item, variables) {
    return new Promise((resolve, reject) => {
      if (this.renderer.canRender(item)) {
        if (this.config.displayProgress) {
          console.time(`createOrUpdate ${item.sys.id}`)
        }
        const url = this.router.resolve(item)
        if (url) {
          this.renderer.render(item, variables)
            .then(content => {
              if (content instanceof Object) {
                const promises = Object.keys(content)
                  .map(k => ({ fileName: k, body: content[k] }))
                  .map(ent => this.fileSystem.write(`${url}/${ent.fileName}`, ent.body))

                return Promise.all(promises)
              } else {
                return this.fileSystem.write(`${url}/index.html`, content)
              }
            })
            .then(() => this.config.displayProgress && console.timeEnd(`createOrUpdate ${item.sys.id}`))
            .then(resolve)
            .catch(err => {
              console.log(`failed to render: ${item.sys.id}`, JSON.stringify(err))
              resolve()
             })
        }
        else {
          resolve('skipped, no url')
        }
      }
      else {
        resolve('skipped, cannot render')
      }
    })
  }

  delete(item) {
    return new Promise((resolve, reject) => {
      if (this.renderer.canRender(item)) {
        const url = this.router.resolve(item)
        if (url) {
          this.fileSystem.delete(`${url}/index.html`)
            .then(resolve)
            .catch(reject)
        }
        else {
          resolve('skipped, no url')
        }
      }
      else {
        resolve('skipped, cannot render')
      }
    })
  }

  storeSyncToken(token) {
    return this.fileSystem.write('.data/synctoken.txt', token)
  }

  readSyncToken() {
    return this.fileSystem.read('.data/synctoken.txt')
  }
}

export default BaseContentGenerator
