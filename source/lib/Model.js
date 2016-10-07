import _ from 'lodash'

class Model {
  constructor(config) {
    this.config = config
  }

  getModel(item, locale = null, maxDepth = 10) {
    locale = locale || this.config.defaultLocale

    const extractLocale = (item) => {
      return _.mapValues(item.fields, (value, key, object) => {
        let ret = null

        if (typeof(value) === 'undefined' || value === null) {
          ret = null
        }
        else if (value.hasOwnProperty(locale)) {
           ret = value[locale]
        }
        else {
          ret = value
        }

        if (ret instanceof Array) {
          ret = _.map(ret, ent => ({ ...extractLocale(ent), $item: ent }))
        }
        else if (ret && ret.hasOwnProperty('fields')) {
          ret = { ...extractLocale(ret), $item: ret }
        }

        return ret
      })
    }

    return {
      ...extractLocale(item),
      $item: item
    }
  }
}

export default Model
