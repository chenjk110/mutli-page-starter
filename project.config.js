/**
 * 项目配置
 * @type {ProjectOptions}
 */
const options = {
  tpl: "hbs",
  css: "scss",
  commonLibrary: {
    js: ["jquery"],
    css: ["normalize.css"],
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    useLocalIp: true
  },
}

module.exports = options

/**
 * @typedef ProjectOptions
 * @property {'hbs'|'handlebars'|'html'|'ejs'|'pug'|'jade'} tpl
 * @property {'css'|'sass'|'scss'|'less'} css
 * @property {{js: string[], css: string[]}} commonLibrary
 * @property {import('webpack-dev-server').Configuration} devServer
 */