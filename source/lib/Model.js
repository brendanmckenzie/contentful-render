import _ from 'lodash'

class Model {
  constructor(config) {
    this.config = config
  }

  getModel(item, locale = null) {
    locale = locale || this.config.defaultLocale

    const extractLocale = (item) => {
      return _.mapValues(item.fields, (value) => {
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
          ret = _.map(ret, ent => ent.hasOwnProperty('fields') ? ({ ...extractLocale(ent), $item: ent }) : ent)
        }
        else if (ret && ret.hasOwnProperty('fields')) {
          ret = Object.assign({}, extractLocale(ret), { $item: ret })
        }

        return ret
      })
    }

    return Object.assign({}, extractLocale(item), {
      $item: item
    })
  }
}

export default Model
