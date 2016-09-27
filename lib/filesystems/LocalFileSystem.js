import FileSystem from '../FileSystem'
import Promise from 'bluebird'
import fse from 'fs-extra'
import path from 'path'

const fs = Promise.promisifyAll(fse)

class LocalFileSystem extends FileSystem {
  constructor(config) {
    super()

    this.config = config
  }

  translatePath(filePath) {
    return path.join(this.config.destPath, filePath)
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
    return new Promise((resolve, reject) => {
      const putObjectConfig = {
        ACL: 'public-read',
        Bucket: this.config.bucket,
        Key: this.translatePath(filePath),
        Body: content,
        ...params
      }

      this.s3.putObjectAsync(putObjectConfig)
        .then(result => resolve(result), err => reject(err))
        .catch(err => reject(err))
    })
  }
}

export default LocalFileSystem
