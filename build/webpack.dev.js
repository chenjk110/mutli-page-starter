const { HotModuleReplacementPlugin } = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const projectOptions = require('../project.config')

const customDevServerOpts = { devServer: projectOptions.devServer || {} }

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    useLocalIp: true,
    hot: true,
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ]
}, customDevServerOpts)