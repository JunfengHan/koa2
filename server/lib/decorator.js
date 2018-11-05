const Router = require('koa-router')
const { resolve } = require('path')
const _ = require('lodash')
const glob = require('glob')

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

// 定义一个类
class Route {
    constructor (app, apiPath) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }

    init () {
        glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

        // ---> 遍历routerMap, 注册所有的路由、控制器及各个方法和中间件
        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            const prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controllers)
        }

        // 注册所有中间件
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}
exports.Route = Route

// 格式化路径
const normalizePath = path => path.startsWith('/') ? path : `/${path}`
// 修饰符 conf
const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)

    // ---> 保存所有的路由、控制器和路由的方法及路由的中间件
    routerMap.set({
        target: target,
        ...conf
    }, target[key])
}

// 修饰符controller ---> 实现路径前缀
const controller = path => target => (target.prototype[symbolPrefix] = path)

const get = path => router({
    method: 'get',
    path: path
})

const post = path => router({
    method: 'post',
    path: path
})

const put = path => router({
    method: 'put',
    path: path
})

const del = path => router({
    method: 'del',
    path: path
})

const use = path => router({
    method: 'use',
    path: path
})

const all = path => router({
    method: 'all',
    path: path
})

exports.controller = controller

exports.get = get
exports.post = post
exports.put = put
exports.del = del
exports.use = use
exports.all = all

