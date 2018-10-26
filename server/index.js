const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')

const { connect, initSchemas } = require('./database/init')

;(async () => {
    await connect()

    initSchemas()

    // ---> 爬取电影粗略数据,并保存到数据库
    require('./tasks/movie')
    // ---> 获取数据库中电影的简易数据，通过豆瓣 API 获取详细数据并分类保存
    require('./tasks/doubanApi')
})()

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'
}))

app.use(async (ctx, next) => {
    await ctx.render('index', {
        name: "Han",
        me: "jun"
    })
})

app.listen(3000)