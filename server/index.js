const Koa = require('koa')
const app = new Koa()
const { htmlTpl, ejsTpl } = require('./tpl')
const ejs = require('ejs')

app.use(async (ctx, next) => {
    ctx.type = 'text/html; chatset=utf-8'
    ctx.body = ejs.render(ejsTpl, {
        name: 'Han',
        sex: 'Man'
    })
})

app.listen(3000)