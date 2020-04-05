const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const {
  colectPages,
  generateEntries,
  generateHtmls,
  createPathResolve,
  isDev
} = require('./utils')

const dirDistStatic = createPathResolve('../dist/static/libs')

const libs = ['jquery', 'bootstrap']

const libsURLs = libs.map(name => `static/libs/${name}/dist/index.js`)
const libsCopyOpts = libs.map(name => ({ from: require.resolve(name), to: dirDistStatic(name, 'dist/index.js') }))

const pages = colectPages()
const htmlPagePlugins = generateHtmls(pages, libsURLs)
const pageEntries = generateEntries(pages)

module.exports = merge({
  mode: 'none',
  entry: {
    ...pageEntries,
  },
  externals: {
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
      ...libsCopyOpts
    ]),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    })
  ]
})
