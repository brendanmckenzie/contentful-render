import dot from 'dot'
import moment from 'moment'

class Router {
  constructor(config, model) {
    this.config = config
    this.model = model
  }

  resolve(item) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return null }

    const model = this.model.getModel(item)

    const template = dot.template(def.route)

    return template({ ...model, $fn: { moment } })
  }
}

export default Router
