import BaseRenderer from './BaseRenderer'
import Promise from 'bluebird'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

class ReactRenderer extends BaseRenderer {
  render(template, model) {
    return new Promise((resolve, reject) => {
      const element = React.createElement(template.body, model)
      const html = '<!DOCTYPE html>' + ReactDOMServer.renderToString(element)
      const json = JSON.stringify({
        ...model,
        $template: template.name
      })

      resolve({
        'index.html': html,
        'data.json': json
      })
    })
  }
}

export default ReactRenderer
