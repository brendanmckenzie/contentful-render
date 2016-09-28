import BaseRenderer from './BaseRenderer'
import Promise from 'bluebird'
import path from 'path'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

class ReactRenderer extends BaseRenderer {
  render(template, model) {
    return new Promise((resolve, reject) => {
      const templateFile = path.join(this.config.templatePath, `/${template}.jsx`)
      const template = require(templateFile)
      const element = React.createElement(template.default, model)

      resolve(ReactDOMServer.renderToString(element))
    })
  }
}

export default ReactRenderer
