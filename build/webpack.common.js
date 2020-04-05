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

const projectOptions = require('../project.config')

const libsJS = [].concat(projectOptions.commonLibrary.js)
const libsCSS = [].concat(projectOptions.commonLibrary.css)

const libsJSOpts = genrateLibsOpts(libsJS)
const libsCSSOpts = genrateLibsOpts(libsCSS)

const htmlParams = {
  libChunks: libsJSOpts.urlList,
  libLinks: libsCSSOpts.urlList,
}

const pages = colectPages(projectOptions.tpl)
const htmlPagePlugins = generateHtmls(pages, htmlParams)
const pageEntries = generateEntries(pages)

const tplLoaders = {
  hbs: {
    test: /\.(hbs|handlebars)$/i,
    use: 'handlebars-loader',
  },
  ejs: {
    test: /\.ejs$/i,
    use: 'ejs-loader'
  },
  pug: {
    test: /\.(pug|jade)$/i,
    use: 'pug-loader'
  }
}

const cssLoaders = {
  sass: {
    test: /\.s(a|c)ss$/i,
    use: [
      isDev
        ? 'style-loader'
        : { loader: MiniCSSExtractPlugin.loader },
      'css-loader',
      'postcss-loader',
      'sass-loader',
    ]
  },
  less: {
    test: /\.less$/i,
    use: [
      isDev
        ? 'style-loader'
        : { loader: MiniCSSExtractPlugin.loader },
      'css-loader',
      'postcss-loader',
      'less-loader'
    ]
  }
}

const additions = {
  jquery: {
    externals: {
      jquery: 'jquery',
      jQuery: 'jquery',
      $: 'jquery'
    },
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      })
    ]
  }
}

const customRules = []

switch (projectOptions.tpl) {
  case 'handlebars':
  case 'hbs':
    customRules.push(tplLoaders['hbs'])
    break
  case 'jade':
  case 'pug':
    customRules.push(tplLoaders['pug'])
    break
  case 'ejs':
    customRules.push(tplLoaders['ejs'])
    break
  default:
    break
}

switch (projectOptions.css) {
  case 'less':
    customRules.push(cssLoaders['less'])
    break
  case 'sass':
    customRules.push(cssLoaders['sass'])
    break
  default:
    break
}

const customAdditonOptions = []

Object.keys(projectOptions.commonLibrary)
  .forEach(type => {
    /** @type {string[]} */
    const libs = projectOptions.commonLibrary[type]

    libs.forEach(libName => {
      const opt = additions[libName]
      opt != null && customAdditonOptions.push(opt)
    })
  })


module.exports = merge({
  mode: 'none',
  entry: {
    ...pageEntries,
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
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'static/images',
              // fallback: 'file-loader',
              quality: 75
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'static/images',
              // fallback: 'file-loader',
              quality: 75
            }
          }
        ],
      },
      {
        test: /\.css$/i,
        use: [
          isDev
            ? 'style-loader'
            : { loader: MiniCSSExtractPlugin.loader },
          'css-loader',
          'postcss-loader',
        ]
      },
      ...customRules
    ]
  },
  plugins: [
    ...htmlPagePlugins,
    new CopyPlugin([
      ...libsJSOpts.copyList,
      ...libsCSSOpts.copyList,
    ]),
  ]
}, ...customAdditonOptions)
