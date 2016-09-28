import dot from 'dot'
import moment from 'moment'

class Router {
  constructor(config) {
    this.config = config
  }

  resolve(item) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return null }

    const model = this.model.fromItem(item)

    const template = dot.template(def.route)

    return template({ ...model, $fn: { moment } })
  }
}

export default Router
