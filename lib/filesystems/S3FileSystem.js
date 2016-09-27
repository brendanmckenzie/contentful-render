import FileSystem from '../FileSystem'
import Promise from 'bluebird'
import AWS from 'aws-sdk'

class S3FileSystem extends FileSystem {
  constructor(config) {
    super()

    this.config = config
  }

  translatePath(filePath) {
    return filePath.replace(/^(\/+)/, '').replace(/(\/{2,})/g, '/')
  }

  read(filePath, params) {
    return new Promise((resolve, reject) => {
      const getObjectConfig = {
        Key: this.translatePath(filePath),
        Bucket: this.config.bucket,
        ...params
      }
      this.s3.getObjectAsync(getObjectConfig)
        .then(result => resolve(result.Body.toString('utf8')))
        .catch(err => resolve(null))
    })
  }

  write(filePath, content, params) {
    return new Promise((resolve, reject) => {
      const fileName = this.translatePath(filePath)

      fs.outputFileAsync(fileName, content, { encoding: 'utf8' })
        .then(resolve, err => reject(err))
        .catch(err => reject(err))
    })
  }
}

export default S3FileSystem
