const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const {
  colectPages,
  generateEntries,
  generateHtmls,
  genrateLibsOpts,
  isDev,
} = require('./utils')

const libsJS = ['jquery', 'bootstrap']
const libsCSS = ['normalize.css']


const libsJSOpts = genrateLibsOpts(libsJS)
const libsCSSOpts = genrateLibsOpts(libsCSS)

const htmlParams = {
  libChunks: libsJSOpts.urlList,
  libLinks: libsCSSOpts.urlList,
}

const pages = colectPages()
const htmlPagePlugins = generateHtmls(pages, htmlParams)
const pageEntries = generateEntries(pages)

module.exports = merge({
  mode: 'none',
  entry: {
    ...pageEntries,
  },
  externals: {
    jquery: 'jquery',
    jQuery: 'jquery',
    $: 'jquery'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
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
        test: /\.css$/,
        use: [
          isDev
            ? 'style-loader'
            : { loader: MiniCSSExtractPlugin.loader },
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/i,
        use: [
          isDev
            ? 'style-loader'
            : { loader: MiniCSSExtractPlugin.loader },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          isDev
            ? 'style-loader'
            : { loader: MiniCSSExtractPlugin.loader },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    ...htmlPagePlugins,
    new CopyPlugin([
      ...libsJSOpts.copyList,
      ...libsCSSOpts.copyList,
    ]),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    })
  ]
})
