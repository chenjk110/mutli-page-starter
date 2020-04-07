const { ProvidePlugin } = require('webpack')
module.exports = {
  jquery: {
    externals: {
      jquery: 'jQuery'
    },
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),
    ],
  },
}
