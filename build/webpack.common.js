const merge = require('webpack-merge')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { isDev } = require('./utils')

module.exports = merge({
  mode: 'none',
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
    ]
  },
  resolve: {
    alias: {
      "@": "./src",
      "@assets": "./src/assets",
      "@components": "./src/common/components",
      "@layouts": "./src/common/layouts",
      "@pages": "./src/pages",
    }
  }
})
