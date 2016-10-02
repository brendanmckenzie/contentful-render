import SitemapGenerator from '../lib/generators/SitemapGenerator'
import LocalFileSystem from '../lib/filesystems/LocalFileSystem'

import config from './config'

const main = () => {
  const generator = new SitemapGenerator(config, LocalFileSystem(config))

  generator.process()
    .then(res => console.log('done', res))
    .catch(err => console.error('error', err))
}

main()
