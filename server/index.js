const Koa = require('koa')
const views = require('koa-views')
const { resolve } = require('path')

const { connect, initSchemas, initAdmin } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router']

// ---> 使用函数式编程加载中间件数组
const userMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

;(async () => {
    await connect()

    initSchemas()
    // await initAdmin()
    // ---> 爬取电影粗略数据,并保存到数据库
    // require('./tasks/movie')
    // ---> 获取数据库中电影的简易数据，通过豆瓣 API 获取详细数据并分类保存
    // require('./tasks/doubanApi')
    // require('./tasks/trailer')
    // require('./tasks/qiniu')

    const app = new Koa()
    
    await userMiddlewares(app)
    
    app.listen(3000)
})()