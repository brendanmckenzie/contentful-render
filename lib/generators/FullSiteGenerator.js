import Generator from '../Generator'

class FullSiteGenerator extends Generator {
  constructor(config, fileSystem) {
    super()

    this.config = config
    this.fileSystem = fileSystem

    this.contentful = new Contentful()
  }

  process(params) {
    return new Promise((resolve, reject) => {
      this.contentful.sync({ initial: true })
        .then(res => {
          // TODO: ...
          resolve()
        })
        .catch(reject)

    })
  }
}

export default FullSiteGenerator
