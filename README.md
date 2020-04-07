# 静态、半静态多页网站开发模版

## 使用场景
**简单静态或轻量动态内容多页官网**

## NPM脚本
**开发模式**
```bash
npm start
```
```bash
npm run dev
```

**生产模式**
```bash
npm run build
```

## 文件夹说明
```bash
├── build        # webpack相关配置
└── src         
    ├── assets   # 静态资源文件夹
    ├── common   # 通用组件、正常存放模版组件、例如layout、button、list等
    └── pages    # 页面内容
```

## 关于创建page使用约定
若需要增加页面，需在**pages**目录下存放页面内容，以文件夹作为路径名称来对应实际的路由嵌套，且js、css、html等独享资源统一放置，例如：
```bash
pages                      # 对应路径 /
    ├── about              # 对应路径 /about
    │   ├── contact        # 对应路径 /about/contact
    │   │   ├── index.hbs  # contact页面html模版
    │   │   └── index.js   # contact页面js
    │   ├── index.hbs      # about页面html模版
    │   └── index.js       # about页面js
    ├── index.hbs          # 首页html模版
    ├── index.js           # 首页js
    └── index.scss         # 首页样式
                            
```

对于样式则需要在index.js中引入，而模版文件则不用引入，例如：

```js
// 在首页的index.js中

import './index.scss' // 引入

```

## 项目配置文件 project.config.js
```js
module.exports = {
  /**
   * 模版选择： 'hbs', 'handlebars', 'ejs', 'pug', 'jade'
   */
  tpl: "hbs",
  
  /**
   * 样式选择： 'css', 'sass', 'scss', 'less'
   */
  css: "sass",

  /**
   * 通用库，配置通用库，直接不参与打包、而是在head中直接引入相关文件
   * 具体渲染细节在components下的HeaderLinks，HeaderScripts中
   */
  commonLibrary: {
    /* 通用JS库列表 */
    js: ["jquery"],
    /* 通用CSS库列表 */
    css: ["normalize.css"],
  },
  // 查看webpack-dev-server配置
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    useLocalIp: true,
  },
}
```

## 辅助脚本
```bash
npm run new [type] [name]
```
通过该脚本，可以快捷创建页面(page)、组件(component)、布局(layout), 使用格式：
```bash
------------------[格式]----------------------
创建页面：npm run new page /home/about/me [...]
创建组件：npm run new comp 组件名称 [...]
创建布局：npm run new layout 布局名称 [...]
----------------------------------------------
```

### 1. 创建页面
```bash
# 单页面
npm run new page /page1/page1_1
```

```bash
# 多页面
npm run new page /page1 /page2 /page3
```

```bash
[Page1]：成功创建模版文件 -> index.hbs
[Page1]: 成功创建样式文件 -> index.scss
[Page1]: 成功创建脚本文件 -> index.js
[成功创建页面：/page1]

[Page2]：成功创建模版文件 -> index.hbs
[Page2]: 成功创建样式文件 -> index.scss
[Page2]: 成功创建脚本文件 -> index.js
[成功创建页面：/page2]

[Page3]：成功创建模版文件 -> index.hbs
[Page3]: 成功创建样式文件 -> index.scss
[Page3]: 成功创建脚本文件 -> index.js
[成功创建页面：/page3]

```

### 2. 创建组件
```bash
# 单组件
npm run new comp Header
```

```bash
# 多组件组件
npm run new comp Avatar Button
```

### 3. 创建布局
```bash
npm run new layout Footer
```

## 特性

模版：

- [x] Handlebars
- [x] EJS
- [x] Pug

样式:

- [x] SASS
- [x] LESS
- [x] PostCSS

