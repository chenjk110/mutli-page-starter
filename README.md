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

## 特性

基本：

- [x] HMR
- [ ] Babel

模版：

- [x] Handlebars
- [ ] EJS
- [ ] Jade

样式:

- [x] SASS
- [ ] LESS
- [ ] PostCSS

静态资源：

- [ ]  SVG
- [ ]  Webp
- [ ]  Webfonts

CSS库集成：

- [ ] Bootstrap
- [ ] 其他

JS库集成：

- [ ] jQuery
- [ ] Zepto
- [ ] 其他

发布支持：

- [ ] Docker
- [ ] Nginx
- [ ] CI/CD

其他：

- [ ] 改造webpack配置，按需生成配置文件
- [ ] 开发环境API代理
- [ ] 编写基本辅助CLI


