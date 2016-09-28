import _ from 'lodash'

class Model {
  constructor(config) {
    this.config = config
  }

  getModel(item, locale = null, maxDepth = 10) {
    locale = locale || this.config.defaultLocale

    let visitedIds = {}

    const extractLocale = (fields, level = 0) => {
      if (level > maxDepth) {
        return fields
      }

      const handleObject = (value) => {
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

      return _.mapValues(fields, (value) => {
        if (typeof(value) === 'undefined' || value === null) {
          return null
        }

        if (value instanceof Array) {
          return _.map(value, handleObject) || []
        }

        if (typeof(value) === 'object' && value.hasOwnProperty(locale)) {
          value = value[locale]
        }

        return handleObject(value)
      })
    }

    return extractLocale(item, 0)
  }
}

export default Model
