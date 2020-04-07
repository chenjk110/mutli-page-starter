const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackDevServer = require('webpack-dev-server')

const {
    isDev,
    isProd,
    createPathResolve,
    genrateLibsOpts,
    colectPages,
    generateHtmls,
    generateEntries,
    generateCustomRules,
    generateCustomLibAdditions,
} = require('./utils')

const projectOptions = require('../project.config')

const configCommon = require('./webpack.common')
const configDev = require('./webpack.dev')
const configProd = require('./webpack.prod')

const dirPages = createPathResolve('../src/pages')()

/**
 * 生成相关的所有待注入的所有配置
 */
function genrateOptions() {
    const libsJS = [].concat(projectOptions.commonLibrary.js)
    const libsCSS = [].concat(projectOptions.commonLibrary.css)
    const libsJSOpts = genrateLibsOpts(libsJS)
    const libsCSSOpts = genrateLibsOpts(libsCSS)
    const htmlParams = {
        libChunks: libsJSOpts.urlList,
        libLinks: libsCSSOpts.urlList,
    }
    const customRules = generateCustomRules(projectOptions)
    const customLibAdditions = generateCustomLibAdditions(projectOptions)
    const pages = colectPages(projectOptions.tpl)
    const htmlPagePlugins = generateHtmls(pages, htmlParams)
    const pageEntries = generateEntries(pages)
    const libsCopies = new CopyPlugin([
        ...libsJSOpts.copyList,
        ...libsCSSOpts.copyList,
    ])
    return { htmlPagePlugins, pageEntries, libsCopies, customRules, customLibAdditions }
}

function createWebpackConfig() {
    const {
        htmlPagePlugins,
        pageEntries,
        libsCopies,
        customRules,
        customLibAdditions,
    } = genrateOptions()

    return merge(configCommon, {
        entry: pageEntries,
        module: {
            rules: customRules
        },
        plugins: [
            libsCopies,
            ...htmlPagePlugins,
        ]
    }, ...customLibAdditions)
}


/**
 * Run compiler
 */
function runCompiler() {
    if (isDev) {
        let devServer
        const runDevServer = () => {
            const config = merge(createWebpackConfig(), configDev)
            const compiler = webpack(config)
            devServer = new WebpackDevServer(compiler, config.devServer)
            const { port, host } = config.devServer
            devServer.listen(port, host)
        }
        fs.watch(dirPages, { recursive: true })
            .on('change', (type) => {
                if (type === 'rename') {
                    console.clear()
                    console.log('[重新编译中......]')
                    devServer.close()
                    runDevServer()
                }
            })
            .on('close', (err) => {
                console.log('关闭pages文件夹监听')
            })

        runDevServer()
    }
    else if (isProd) {
        const config = merge(createWebpackConfig(), configProd)
        const compiler = webpack(config)
        compiler.run((err, stats) => {
            process.stdout.write(stats.toString({
                colors: true,
                children: false
            }))
        })
    }
}

runCompiler()



