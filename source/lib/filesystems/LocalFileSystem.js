import FileSystem from '../FileSystem'
import Promise from 'bluebird'
import AWS from 'aws-sdk'

class LocalFileSystem extends FileSystem {
  constructor(config) {
    super()

    this.config = config
  }

  translatePath(filePath) {
    return filePath.replace(/^(\/+)/, '').replace(/(\/{2,})/g, '/')
  }

  read(filePath, params) {
    return new Promise((resolve, reject) => {
      try {
        const fileName = this.translatePath(filePath)

        fs.readFileAsync(fileName)
          .then(data => resolve(data.toString()))
          .catch(err => resolve(null))
      }
      catch (ex) {
        resolve(null)
      }
    })
  }

  write(filePath, content, params) {
    const fileName = this.translatePath(filePath)

    return fs.outputFileAsync(fileName, content, { encoding: 'utf8' })
      .then(resolve, err => reject(err))
      .catch(err => reject(err))
  }

  delete(filePath) {
    const fileName = this.translatePath(filePath)

    return fs.deleteFileAsync(fileName)
  }
}

export default LocalFileSystem
