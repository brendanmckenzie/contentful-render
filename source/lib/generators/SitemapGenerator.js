import Promise from 'bluebird'
import moment from 'moment'
import Generator from '../Generator'

class SitemapGenerator extends Generator {
  constructor(config, fileSystem) {
    super(config, fileSystem)
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
          const url = this.router.resolve(item, true)
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
    const innerXml = items.filter(ent => !!ent && !!ent.url)
      .map(ent => `<url><loc>${ent.url}</loc><lastmod>${ent.lastmod}</lastmod></url>`)
      .join('')

    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${innerXml}</urlset>`
  }

  writeSitemap(xml) {
    return this.fileSystem.write('sitemap.xml', xml)
  }
}

export default SitemapGenerator
