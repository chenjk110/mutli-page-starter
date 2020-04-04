const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const createPathResolve = dir => (...args) => path.resolve(__dirname, dir, ...args)

const resolvePagesDir = createPathResolve('../src/pages')


function colectPages() {
  const entryPath = resolvePagesDir()

  const tplFiles = glob(entryPath + '/**/index.hbs', { sync: true })
  const jsFiles = glob(entryPath + '/**/index.js', { sync: true })

  const pages = tplFiles.map(name => name.replace(entryPath + '/', '').replace(/\/?index.*/, ''))

  const entries = pages.map((pageName, idx) => {
    const opt = {
      name: pageName === '' ? 'root': pageName,
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
 */
function generateHtmls(pages) {
  return pages.map(pageOpt => {
    const { name, tpl } = pageOpt
    const filename = name === 'root' ? `index.html` : `${name}/index.html`
    return new HtmlWebpackPlugin({
      title: true,
      filename,
      template: tpl,
      chunks: [name]
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
  isDev
}