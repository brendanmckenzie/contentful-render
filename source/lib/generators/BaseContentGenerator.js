import Generator from '../Generator'

class BaseContentGenerator extends Generator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super()

    this.config = config
    this.fileSystem = fileSystem
    this.contentful = contentful
    this.router = router
    this.renderer = renderer
  }

  process(params) { }

  handleUpdates(res) {
    const tasks = _.map(res.entries, item => { action: 'createOrUpdate', item })

    const chunks = _(tasks).chunk(5).value()
    return Promise.each(chunks, (actions, i, length) => {
      const promises = actions.map(ent => this[ent.action](ent.item))

      return Promise.all(promises)
    })
  }

  createOrUpdate(item) {
    return new Promise((resolve, reject) => {
      if (this.renderer.canRender(item)) {
        const url = this.router.resolve(item)
        if (url) {
          const content = this.renderer.render(item)

          this.fileSystem.write(`${url}/index.html`, content)
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
    return this.fileSystem.read('./data/synctoken.txt')
  }
}

export default FullSiteGenerator
