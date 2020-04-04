const merge = require('webpack-merge')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const {
  colectPages,
  generateEntries,
  generateHtmls,
  isDev
} = require('./utils')

const pages = colectPages()
const htmlPagePlugins = generateHtmls(pages)
const pageEntries = generateEntries(pages)

module.exports = merge({
  mode: 'none',
  entry: pageEntries,
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              filename: 'static/fonts/[name].[ext]?[contenthash:6]',
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              filename: 'static/images/[name].[contenhash:6].[ext]',
            }
          },
        ],
      },
      {
        test: /\.(hbs|handlebars|html)$/i,
        use: 'handlebars-loader',
      },
      {
        test: /\.(css|s(a|c)ss)$/i,
        use: [
          isDev
            ? 'style-loader'
            : { loader: MiniCSSExtractPlugin.loader },
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    ...htmlPagePlugins,
  ]
})
