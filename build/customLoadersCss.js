const isDev = process.env.NODE_ENV === 'development'

const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  sass: {
    test: /\.s(a|c)ss$/i,
    use: [
      isDev ? 'style-loader' : { loader: MiniCSSExtractPlugin.loader },
      'css-loader',
      'postcss-loader',
      'sass-loader',
    ],
  },
  less: {
    test: /\.less$/i,
    use: [
      isDev ? 'style-loader' : { loader: MiniCSSExtractPlugin.loader },
      'css-loader',
      'postcss-loader',
      'less-loader',
    ],
  },
}
