import _ from 'lodash'

class Model {
  constructor(config) {
    this.config = config
  }

  getModel(item, locale = null, maxDepth = 10) {
    locale = locale || this.config.defaultLocale

    let visitedIds = {}

    const handleObject = (fields, value, level) => {
      if (typeof(value) === 'object' && value !== null) {
        if (value.hasOwnProperty('fields')) {
          if (value.sys && value.sys.id) {
            if (visitedIds[value.sys.id]) {
              return value
            }
            visitedIds[value.sys.id] = value
          }
          value.fields = extractLocale(value.fields, level + 1)
          if (value.sys && value.sys.id) {
            visitedIds[value.sys.id] = value
          }
        }
        else {
          value = extractLocale(value, level + 1)
        }
      }

      return value
    }

    const extractLocale = (fields, level = 0) => {
      if (level > maxDepth) {
        return fields
      }

      return _.mapValues(fields, value => {
        if (typeof(value) === 'undefined' || value === null) {
          return null
        }

        if (value instanceof Array) {
          return _.map(value, ent => handleObject(fields, ent, level)) || []
        }

        if (typeof(value) === 'object' && value.hasOwnProperty(locale)) {
          value = value[locale]
        }

        return handleObject(fields, value, level)
      })
    }

    return {
      ...extractLocale(item, 0).fields,
      $item: item
    }
  }
}

export default Model
