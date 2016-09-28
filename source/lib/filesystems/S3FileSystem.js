import FileSystem from '../FileSystem'
import Promise from 'bluebird'
import path from 'path'

class S3FileSystem extends FileSystem {
  constructor(config) {
    super()

    this.config = config
  }

  translatePath(filePath) {
    return path.join(this.config.destPath, filePath)
  }

  read(filePath, params) {
    const getObjectConfig = {
      Key: this.translatePath(filePath),
      Bucket: this.config.bucket,
      ...params
    }
    return this.s3.getObjectAsync(getObjectConfig)
      .then(result => result.Body.toString('utf8'))
      .catch(err => resolve(null))
  }

  write(filePath, content, params) {
    const putObjectConfig = {
      ACL: 'public-read',
      Bucket: this.config.bucket,
      Key: this.translatePath(filePath),
      Body: content,
      ...params
    }

    return this.s3.putObjectAsync(putObjectConfig)
      .then(result => resolve(result), err => reject(err))
      .catch(err => reject(err))
  }

  delete(filePath) {
    const deleteObjectConfig = {
      Bucket: this.config.bucket,
      Key: this.translatePath(filePath)
    }

    return this.s3.deleteObjectAsync(putObjectConfig)
      .then(result => resolve(result), err => reject(err))
      .catch(err => reject(err))
  }
}

export default S3FileSystem
