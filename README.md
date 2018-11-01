# koa2
koa2 project

## 路由
### 1. 引入路由组件 koa-router
    适用一般 api 较少的项目，如果有上百个 api 就显得臃肿
### 2. 通过装饰器（Decorator）对 koa-router 进行抽象封装，实现路由空间分离
    使用 babel 和相关组件完成对ES6、ES7语法的支持；
    创建 .babelrc 配置文件