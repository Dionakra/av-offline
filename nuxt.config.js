module.exports = {
  build: {
    vendor: ['axios'] // Add axios in the vendor.bundle.js
  },
  loading: {
    color: '#4FC08D',
    failedColor: '#bf5050',
    duration: 1500
  },
  css:[
    'bulma/css/bulma.css',
  ],
  head: {
    title: 'Default title'
  },
  generate: {
    routes: [
      '/'
    ]
  }
}
