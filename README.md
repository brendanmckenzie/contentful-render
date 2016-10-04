# Contentful Render

This library provides abstractions for generating static websites from content stored in [Contentful](https://www.contentful.com).

This project started as a means to run static site generation in a Lambda function.

Eventually the method of data access will be abstracted and it will work with any CMS service, such as [Prismic.io](https://prismic.io).

## Getting started

A simple Lambda function for generating a static site to be consumed as a webhook, called from Contentful, could look like this.

    import { FullSiteGenerator, S3FileSystem } from 'contentful-render'

    import config from './config' // see below for an example config file

    export default handler = (event, context, callback) => {
      const generator = new FullSiteGenerator(config, S3FileSystem(config))

      generator.process()
        .then(res => console.log('done', res))
        .catch(err => console.error('error', err))
    }


## Developing locally

To debug how the site will look when generated you can use the provided express host simply like this, where the config is the same as when supplied to the Lambda function.

    import { Host } from 'contentful-render'
    import config from './config'

    Host(config)


## Example configuration

    const config = {
      defaultLocale: 'en-US',
      templatePath: './templates',
      bucket: '...',
      destPath: '/'
      contentful: {
        apiKey: '...',
        space: '...'
      },
      contentTypes: {
        'content': { // this maps contentful Content Models to templates
          canRender: true, // indicates that this type of content should generate an output
          renderSystem: 'ejs', // can be 'ejs' or 'react'
          route: '/{{=it.slug}}',
          template: 'content', // the name of the template to use
          resolve: (url, contentful) => { // this method is used by the debug server to
            const parts = url.split('/')
            const slug = parts[1]

            const params = {
              'content_type': 'content',
              'fields.slug': slug
            }
            return contentful.getEntries(params)
              .then(res => res.items[0])
          }
        }
      },
      variables: {
        siteSettings: (contentful, model) => {
          const params = {
            'content_type': 'siteSettings'
          }
          return contentful.getEntries(params)
            .then(res => res.items[0])
        }
      }
    }

    export default config