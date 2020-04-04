const merge = require('webpack-merge')
const { HotModuleReplacementPlugin } = require('webpack')
const common = require('./webpack.common')
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
})