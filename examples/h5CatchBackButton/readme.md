# 在h5中劫持浏览器返回和物理返回逻辑

## 例子

1. [多页面应用 + pushstate + popstate](./demo-1)
2. [多页面应用 + hashchange](./demo-2)
3. [单页面应用 + Html5 history api/hashchange](./demo-3) 

## 使用

[单页面应用 + Html5 history api/hashchange](./demo-3)，`node server.js`启动`webpack-dev-server`，`node build.js`打包构建

只支持传`--progress`参数，作用和`webpack cli`的一样

`node server.js --progress`或者`node build.js --progress`

