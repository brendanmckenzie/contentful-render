import Promise from 'bluebird'
import dot from 'dot'
import moment from 'moment'
import Generator from '../Generator'

class SitemapGenerator extends Generator {
  constructor(config, fileSystem, contentful, router, renderer) {
    super()

    this.config = config
    this.fileSystem = fileSystem
    this.contentful = contentful
    this.router = router
    this.renderer = renderer
  }

  process(params) {
    return this.contentful.sync({ initial: true })
      .then(res => this.generateSitemap(res))
      .then(res => this.generateXml(res))
      .then(res => this.writeSitemap(res))
  }

  generateSitemap(res) {
    const promises = res.entries.map(item =>
      new Promise((resolve, reject) => {
        if (this.renderer.canRender(item)) {
          const url = this.router.resolve(item)
          if (url) {
            resolve({
              url,
              lastmod: moment(item.fields.date).format("YYYY-MM-DD")
            })
          }
        }
        resolve(null)
      })
    )

    return Promise.all(promises)
  }

  generateXml(items) {
    const validItems = items.filter(ent => !!ent && !!ent.url) // ignore null entries

    const template = dot.template('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{{=it.items}}</urlset>')
    const itemTemplate = dot.template('<url><loc>{{=it.url}}</loc><lastmod>{{=it.lastmod}}</lastmod></url>')

    return template({
      items: validItems.map(ent => itemTemplate({ ...ent, $fn: { moment } })).join('')
    })
  }

  writeSitemap(xml) {
    return this.fileSystem.write('sitemap.xml', xml)
  }
}

export default SitemapGenerator
