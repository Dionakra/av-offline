const pkg = require('./package')

module.exports = {
  mode: 'universal',
  head: {
    title: 'Arenavision Mirror',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/bulma'
  ],
  axios: {
    // proxyHeaders: false
  },
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    extend(config, ctx) {
      
    }
  }
}
