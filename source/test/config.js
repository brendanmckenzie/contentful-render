const config = {
  defaultLocale: 'en-US',
  templatePath: './templates',
  outputPath: '_build',
  contentful: {
    apiKey: 'bed27f1238b89efd12ca24b1c87d5e8ec94161dda3cc7da4ed1b55d007e479ab',
    space: 'oadra9jx0s9q'
  },
  contentTypes: {
    'content': {
      canRender: true,
      renderSystem: 'ejs',
      route: '/{{=it.slug}}',
      template: 'content',
      resolve: (url, contentful) => {
        const parts = url.split('/')
        const slug = parts[1]

        const params = {
          'content_type': 'content',
          'fields.slug': slug
        }
        return contentful.getEntries(params)
          .then(res => {
            return res.items[0]
          })
      }
    }
  }
}

export default config