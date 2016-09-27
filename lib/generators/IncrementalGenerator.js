import Generator from '../Generator'

class IncrementalGenerator extends Generator {
  constructor(config, fileSystem) {
    super()

    this.config = config
    this.fileSystem = fileSystem
  }

  process(params) {

  }
}

export default IncrementalGenerator
