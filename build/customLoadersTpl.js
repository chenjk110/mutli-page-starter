module.exports = {
  hbs: {
    test: /\.(hbs|handlebars)$/i,
    use: 'handlebars-loader',
  },
  ejs: {
    test: /\.ejs$/i,
    use: 'ejs-loader',
  },
  pug: {
    test: /\.(pug|jade)$/i,
    use: 'pug-loader',
  },
}
