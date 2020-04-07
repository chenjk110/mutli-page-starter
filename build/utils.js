const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const tplLoaders = require('./customLoadersTpl')
const cssLoaders = require('./customLoadersCss')
const libAdditions = require('./customLibAdditions')

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const createPathResolve = dir => (...args) => path.resolve(__dirname, dir, ...args)

const resolvePagesDir = createPathResolve('../src/pages')
const dirDistStatic = createPathResolve('../dist/static/libs')

/**
 * 获取公共库的配置信息，包括库路径、script、link引用路径
 * @param {string[]} libs 
 */
function genrateLibsOpts(libs = []) {
  const copyList = []
  const urlList = []
  libs.forEach(name => {
    const pathResolved = require.resolve(name)
    const pathFrom = pathResolved.replace(/(?=\/dist\/).*/, '/dist')
    const linkTo = `static/libs/${pathResolved.match(/(?<=node_modules\/).*/)[0]}`
    const pathTo = dirDistStatic(name, pathResolved.includes('dist') ? 'dist' : name)
    copyList.push({ from: pathFrom, to: pathTo })
    urlList.push(linkTo)
  })
  return { copyList, urlList }
}

/**
 * 收集pages文件夹下的所有页面信息
 * @param {string} ext 模版文件对应扩展名
 * @returns {{name:string,tpl:string,js:string}[]}
 */
function colectPages(ext = '') {
  const entryPath = resolvePagesDir()

  const tplFiles = glob(`${entryPath}/**/index.${ext}`, { sync: true })
  const jsFiles = glob(`${entryPath}/**/index.js`, { sync: true })

  const pages = tplFiles.map(name => name.replace(entryPath + '/', '').replace(/\/?index.*/, ''))

  const entries = pages.map((pageName, idx) => {
    const opt = {
      name: pageName === '' ? 'root' : pageName,
      tpl: tplFiles[idx],
      js: jsFiles[idx]
    }
    return opt
  })

  return entries
}

/**
 * 生成所有页面的HtmlWebpackPlugin数组
 * @param {{name:string,tpl:string,js:string}[]} pages pages所有页面信息
 * @param {{libChunks: string[], libLinks: string[]}} opts 通用库配置信息
 * @returns {HtmlWebpackPlugin[]}
 */
function generateHtmls(pages, opts = {}) {
  const { libChunks = [], libLinks = [] } = opts
  return pages.map(pageOpt => {
    const { name, tpl } = pageOpt
    const filename = name === 'root' ? `index.html` : `${name}/index.html`
    return new HtmlWebpackPlugin({
      title: true,
      filename,
      template: tpl,
      // libChunks,
      // libLinks,
      templateParameters: {
        libChunks,
        libLinks,
      },
      chunks: [name, ...libChunks]
    })
  })
}

/**
 * 生成所有页面的js入口配置
 * @param {{name:string,tpl:string,js:string}[]} pages 所有页面配置信息
 */
function generateEntries(pages) {
  return pages.reduce((entries, pageOpt) => {
    const { name, js } = pageOpt
    entries[name] = js
    return entries
  }, {})
}


/**
 * 生成通用库额外配置信息
 * @param {ProjectOptions} projectOptions 项目配置 
 */
function generateCustomLibAdditions(projectOptions) {
  const customAdditonOptions = []

  Object.keys(projectOptions.commonLibrary)
    .forEach(type => {
      /** @type {string[]} */
      const libs = projectOptions.commonLibrary[type]

      libs.forEach(libName => {
        const opt = libAdditions[libName]
        opt != null && customAdditonOptions.push(opt)
      })
    })

  return customAdditonOptions
}


/**
 * 生成自定义的rules配置
 * @param {ProjectOptions} projectOptions 项目配置
 */
function generateCustomRules(projectOptions) {
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
    case 'scss':
      customRules.push(cssLoaders['sass'])
      break
    default:
      break
  }

  return customRules
}

module.exports = {
  createPathResolve,
  colectPages,
  generateHtmls,
  generateEntries,
  genrateLibsOpts,
  dirDistStatic,
  isDev,
  isProd,
  generateCustomRules,
  generateCustomLibAdditions,
}

/** -------- type defination -------- */
/**
 * @typedef ProjectOptions
 * @property {'hbs'|'handlebars'|'html'|'ejs'|'pug'|'jade'} tpl
 * @property {'css'|'sass'|'scss'|'less'} css
 * @property {{js: string[], css: string[]}} commonLibrary
 * @property {import('webpack-dev-server').Configuration} devServer
 */