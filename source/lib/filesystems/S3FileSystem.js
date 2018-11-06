import FileSystem from '../FileSystem'
import path from 'path'
import AWS from 'aws-sdk'
import mime from 'mime-types'


class S3FileSystem extends FileSystem {
  constructor(config) {
    super()

    this.config = config

    this.s3 = new AWS.S3()
  }

  translatePath(filePath) {
    return path.join(this.config.destPath, filePath)
      .replace(/\\/g, '/')
      .replace(/^(\/+)/, '')
      .replace(/(\/{2,})/g, '/')
  }

  read(filePath, params) {
    const getObjectConfig = Object.assign({}, {
      Key: this.translatePath(filePath),
      Bucket: this.config.bucket
    }, params)

    return this.s3.getObject(getObjectConfig)
      .promise()
      .then(result => result.Body.toString('utf8'))
      .catch(err => {
        console.log('s3.getObject error', getObjectConfig, err)

        return null
      })
  }

  write(filePath, content, params) {
    const putObjectConfig = Object.assign({}, {
      ACL: 'public-read',
      Bucket: this.config.bucket,
      Key: this.translatePath(filePath),
      Body: content,
      ContentType: mime.lookup(filePath) || 'text/html',
    }, params)

    return this.s3.putObject(putObjectConfig).promise()
  }

  delete(filePath) {
    const deleteObjectConfig = {
      Bucket: this.config.bucket,
      Key: this.translatePath(filePath)
    }

    return this.s3.deleteObject(deleteObjectConfig).promise()
  }
}

export default S3FileSystem
