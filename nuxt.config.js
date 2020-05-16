const pkg = require('./package')

module.exports = {
  /*router: {
    base: '/av-offline'
  },*/
  generate: {
    dir: 'docs'
  },
  env: {
    baseURL: 'http://localhost:3000/av-offline'
  },
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
    '@nuxtjs/bulma',
    '@nuxtjs/pwa'
  ],
  axios: {
    // proxyHeaders: false
  },
  manifest: {
    name: "Arenavision",
    description: "Arenavision Mirror",
    theme_color: "#f02e2d"
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
