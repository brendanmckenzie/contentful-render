import dot from 'dot'
import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'

class Router {
  constructor(config, model, contentful) {
    this.config = config
    this.model = model
    this.contentful = contentful
  }

  resolve(item, absolute) {
    const def = this.config.contentTypes[item.sys.contentType.sys.id]
    if (!def) { return null }

    const model = this.model.getModel(item)

    const template = dot.template(def.route)

    const relative = template({ ...model, $fn: { moment } })
    if (absolute) {
      return `${this.config.baseUrl}${relative}`
    }
    else {
      return relative
    }
  }

  getContentByUrl(url) {
    const promises = _(this.config.contentTypes)
      .pickBy(ent => ent.canRender && ent.resolve)
      .map(ent => ent.resolve)
      .filter(ent => typeof(ent) === 'function')
      .map(ent => ent(url, this.contentful))

    return Promise.all(promises)
      .then(res => {
        return _(res)
          .filter(ent => !!ent)
          .first()
      })
  }
}

export default Router
