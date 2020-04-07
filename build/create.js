const { statSync, readFileSync, mkdirSync, rmdirSync, writeFileSync } = require('fs')
const { createPathResolve } = require('./utils')
const projectOptions = require('../project.config')

const argv = process.argv.slice(2)

const [type, ...targets] = argv

const resolveDirPages = createPathResolve('../src/pages')
const resolveDirComp = createPathResolve('../src/common/components')
const resolveDirLayout = createPathResolve('../src/common/layouts')

const getCompLayoutTpls = (type, title) => {
    const tpls = {
        pug: `//  ${type}: ${title}`,
        jade: `// ${type}: ${title}`,
        ejs: `<!- ${type}: ${title} ->`,
        hbs: `{{!-- ${type}: ${title} --}}`,
        handlebars: `{{!-- ${type}: ${title} --}}`,
    }
    return tpls[projectOptions.tpl]
}

const printFormatErr = () => {
    console.error('!!无效格式!!', `'npm run new ${argv.join(' ')}'`)
}

const printHelp = () => {
    console.log('------------------[格式]----------------------')
    console.log('创建页面：npm run new page /home/about/me [...]')
    console.log('创建组件：npm run new comp 组件名称 [...]')
    console.log('创建布局：npm run new layout 布局名称 [...]')
    console.log('----------------------------------------------')
}

const printErrAndExit = () => {
    printFormatErr()
    printHelp()
    return
}

const testType = t => /page|comp|layout/i.test(t)
const testPath = p => /(\/\.*)+/i.test(p)

const createPage = (target) => {
    let title = target.split('/').slice(-1)[0]
    title = title[0].toUpperCase() + title.slice(1)

    let htmlFileRaw = readFileSync(
        __dirname + '/tpls/tpl.html',
        { encoding: 'utf8' }
    )
    htmlFileRaw = htmlFileRaw.replace('{{TITLE}}', title)

    let cssFileRaw = readFileSync(
        __dirname + '/tpls/tpl.css',
        { encoding: 'utf8' }
    )

    cssFileRaw = cssFileRaw.replace('{{TITLE}}', title)

    let jsFileRaw = readFileSync(
        __dirname + '/tpls/tpl.js',
        { encoding: 'utf8' }
    )

    jsFileRaw = jsFileRaw
        .replace('{{TITLE}}', title)
        .replace('{{CSS_EXT}}', projectOptions.css)

    try {
        // 创建对应html模版
        writeFileSync(target + `/index.${projectOptions.tpl}`, htmlFileRaw)
        console.log(`[${title}]：成功创建模版文件 -> index.${projectOptions.tpl}`)
        // 创建对应css文件
        writeFileSync(target + `/index.${projectOptions.css}`, cssFileRaw)
        console.log(`[${title}]: 成功创建样式文件 -> index.${projectOptions.css}`)
        // 创建对应js文件
        writeFileSync(target + `/index.js`, jsFileRaw)
        console.log(`[${title}]: 成功创建脚本文件 -> index.js`)
    } catch (err) {
        console.log(err)
        rmdirSync(target)
    }
}

const createComp = (target) => {
    let title = target.split('/').slice(-1)[0]
    title = title[0].toUpperCase() + title.slice(1)
    const tpl = getCompLayoutTpls('组件', title)
    try {
        writeFileSync(target + `.${projectOptions.tpl}`, tpl, { encoding: 'utf8' })
        console.log(`成功创建组件文件 -> ${target}`)
    } catch (err) {
        console.log(err)
        rmdirSync(target)
    }
}

const createLayout = (target) => {
    let title = target.split('/').slice(-1)[0]
    title = title[0].toUpperCase() + title.slice(1)
    const tpl = getCompLayoutTpls('布局', title)
    try {
        writeFileSync(target + `.${projectOptions.tpl}`, tpl, { encoding: 'utf8' })
        console.log(`成功创建布局文件 -> ${target}`)
    } catch (err) {
        console.log(err)
        rmdirSync(target)
    }
}


function runCreatation() {
    targets.forEach(targetPath => {
        const isValidInputs = (!type || !targetPath)
            || (!testType(type))
            || (/page/i.test(type) && !testPath(targetPath))
            || (/layout|comp/i.test(type) && testPath(targetPath))

        if (isValidInputs) {
            printErrAndExit()
            return
        }

        // 目标文件地址
        let target = ''
        if (/page/.test(type)) {
            target = resolveDirPages(targetPath.slice(1))
        }
        else if (/comp/.test(type)) {
            target = resolveDirComp(targetPath)
        }
        else if (/layout/.test(type)) {
            target = resolveDirLayout(targetPath)
        }

        try {
            // 补充模版扩展名
            if (/comp|layout/.test(type)) {
                statSync(target + `.${projectOptions.tpl}`)
            } else {
                statSync(target)
            }

            console.log(`!!已存在: ${target} `)

            return

        } catch (err) {

            if (type === 'page') {
                mkdirSync(target)
                createPage(target)
                console.log(`[成功创建页面：${targetPath}]`, '\n')
            }
            else if (type === 'comp') {
                createComp(target)
                console.log(`[成功创建组件：${targetPath}]`, '\n')
            }
            else if (type === 'layout') {
                createLayout(target)
                console.log(`[成功创建布局：${targetPath}]`, '\n')
            }
        }
    })
}

runCreatation()