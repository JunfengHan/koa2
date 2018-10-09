const Koa = require('koa')

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.body = '开始使用koa吧'
})

app.listen(3000)