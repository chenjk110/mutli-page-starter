const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const createPathResolve = dir => (...args) => path.resolve(__dirname, dir, ...args)

const resolvePagesDir = createPathResolve('../src/pages')

const dirDistStatic = createPathResolve('../dist/static/libs')

const genrateLibsOpts = function (libs = []) {
  const copyList = []
  const urlList = []
  libs.forEach(name => {
    const pathResolved = require.resolve(name)
    const pathFrom = pathResolved.replace(/(?=\/dist\/).*/, '/dist')
    const linkTo = `static/libs/${pathResolved.match(/(?<=node_modules\/).*/, '')[0]}`
    const pathTo = dirDistStatic(name, 'dist')
    copyList.push({ from: pathFrom, to: pathTo })
    urlList.push(linkTo)
  })
  return { copyList, urlList }
}


function colectPages() {
  const entryPath = resolvePagesDir()

  const tplFiles = glob(entryPath + '/**/index.hbs', { sync: true })
  const jsFiles = glob(entryPath + '/**/index.js', { sync: true })

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
 * 
 * @param {{name:string,tpl:string,js:string}[]} pages 
 * @param {{libChunks: string[], libLinks: string[]}} opts
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
 * 
 * @param {{name:string,tpl:string,js:string}[]} pages 
 */
function generateEntries(pages) {
  return pages.reduce((entries, pageOpt) => {
    const { name, js } = pageOpt
    entries[name] = js
    return entries
  }, {})
}


module.exports = {
  createPathResolve,
  colectPages,
  generateHtmls,
  generateEntries,
  genrateLibsOpts,
  dirDistStatic,
  isDev
}