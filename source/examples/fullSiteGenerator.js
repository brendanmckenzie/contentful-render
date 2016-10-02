import FullSiteGenerator from '../lib/generators/FullSiteGenerator'
import LocalFileSystem from '../lib/filesystems/LocalFileSystem'

import config from './config'

const main = () => {
  const generator = new FullSiteGenerator(config, LocalFileSystem(config))

  generator.process()
    .then(res => console.log('done', res))
    .catch(err => console.error('error', err))
}

main()
