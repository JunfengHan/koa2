const mongoose = require('mongoose')
const glob = require('glob')
const db = 'mongodb://localhost'
const { resolve } = require('path')

mongoose.Promise = global.Promise

// ---> 初始化所有schema
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
    // ---> 计数连接错误次数
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
    
        mongoose.connect(db)
    
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
            // const Dog = mongoose.model('Dog', { name: String })
            // const doga = new Dog({ name: '阿尔法' })

            // doga.save().then(() => {
            //   console.log('wang')
            // })

            resolve()
            console.log('MongoDB 数据库连接成功！')
        })
    })
}