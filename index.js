// example config
{
  templatePath: './templates',
  contentTypes: {
    'standardContent': {
      canRender: true,
      template: 'standard-content',
      renderSystem: 'ejs',
      route: '/{{=it.slug}}',
      resolve: (route) => {

      }
    }
  }
}