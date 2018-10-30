const mongoose = require('mongoose')
const glob = require('glob')
const db = 'mongodb://localhost:27018'
const { resolve } = require('path')

mongoose.Promise = global.Promise

// ---> 初始化所有schema
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
    const User = mongoose.model('User')
    let user = await User.findOne({
        username: 'hanTest'
    })
    if (!user) {
        const user = new User({
            userName: 'hanTest01',
            email: 'fda@fddfdq.com014',
            passWord: 'fdaffdafdadfsf01'
        })

        await user.save()
    }
}

exports.connect = () => {
    // ---> 计数连接错误次数
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
    
        mongoose.connect(db, { useNewUrlParser: true })
    
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++

            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，赶快修吧！！！')
            }
        })
    
        mongoose.connection.on('error', err => {
            console.log(err)
           
            maxConnectTimes++

            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，赶快修吧！！！')
            }
        })
    
        mongoose.connection.once('open', () => {
            resolve()
            console.log('MongoDB 数据库连接成功！')
        })
    })
}