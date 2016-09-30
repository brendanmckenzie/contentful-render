import EjsRenderer from './renderers/EjsRenderer'
import ReactRenderer from './renderers/ReactRenderer'

class Renderer {
  constructor(config, model) {
    this.config = config
    this.model = model

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

  render(item) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return null }

    const renderer = this.rendererMap[def.renderSystem]
    if (!renderer) { return null }

    const model = this.model.getModel(item)

    return renderer.render(def.template, { model })
  }
}

export default Renderer
