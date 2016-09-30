import BaseRenderer from './BaseRenderer'
import Promise from 'bluebird'
import ejs from 'ejs'
import path from 'path'

class EjsRenderer extends BaseRenderer {
  render(template, model) {
    return new Promise((resolve, reject) => {
      const templateFile = path.join(this.config.templatePath, `${template}.ejs`)
      const params = {
        root: this.config.templatePath,
        rmWhitespace: true,
        strict: false
      }
      ejs.renderFile(templateFile, model, params,
        (err, res) => {
          if (err) {
            return reject(err)
          }

          resolve(res)
        })
    })
  }
}

export default EjsRenderer
