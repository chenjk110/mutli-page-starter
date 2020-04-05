const merge = require('webpack-merge')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { createPathResolve } = require('./utils')

const common = require('./webpack.common')

const pathDist = createPathResolve('../dist')()

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: pathDist,
    filename(chunkData) {
      return `static/js/${
        chunkData.chunk.name.replace('/', '.')
        }.[chunkhash:6].js`
    },
    chunkFilename: '[chunkhash:6].js',
    // publicPath: ''
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