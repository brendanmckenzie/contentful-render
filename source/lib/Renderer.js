import EjsRenderer from './renderers/EjsRenderer'
import ReactRenderer from './renderers/ReactRenderer'

import marked from 'marked'

class Renderer {
  constructor(config, model, router) {
    this.config = config
    this.model = model
    this.router = router

    // TODO: move this to config to allow for extensibility
    this.rendererMap = {
      'ejs': new EjsRenderer(this.config),
      'react': new ReactRenderer(this.config)
    }
  }

  canRender(item) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return false }

    return !!def.canRender
  }

  render(item, variables, fullModel) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return new Promise(resolve => resolve()) }

    const renderer = this.rendererMap[def.renderSystem]
    if (!renderer) { return new Promise(resolve => resolve()) }

    const model = this.model.getModel(item, fullModel)

    variables = variables || {}

    return renderer.render(def.template, {
      variables,
      model,
      md: (input) => marked(input || ''),
      contentUrl: (model) => this.router.resolve(model.$item ? model.$item : model)
    })
  }
}

export default Renderer
