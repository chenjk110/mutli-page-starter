const merge = require('webpack-merge')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { createPathResolve } = require('./utils')

const dirDist = createPathResolve('../dist')()

module.exports = merge({
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: dirDist,
    filename(chunkData) {
      return `static/js/${
        chunkData.chunk.name.replace('/', '.')
        }.[chunkhash:6].js`
    },
    chunkFilename: 'static/js/[name].[chunkhash:6].js',
    // publicPath: ''
  },
  optimization: {
    splitChunks: {
      minChunks: 2,
      chunks: 'all',
      maxInitialRequests: 3,
      maxAsyncRequests: 6,
      name: 'chunks'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      moduleFilename(chunk) {
        return `static/css/${
          chunk.name.replace('/', '.')
          }.[chunkhash:6].css`
      },
      chunkFilename: 'static/css/[id].[chunkhash:6].css'
    }),
  ]
})