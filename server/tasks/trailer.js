// ---> 获取预览详情页面，发送进程消息给 crawler/video.js 来爬取相关数据；
// ---> 接收消息获取爬到的 video 数据并操作
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {
    let movies = await Movie.find({
        $or: [
            { video: { $exists: false}},
            { video: false }
        ]
    }) 
    const script = resolve(__dirname, '../crawler/video')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
        if (invoked) return

        invoked = true
        console.log(err)
    })

    child.on('exit', code => {
        if (invoked) return

        invoked = true
        let err = code === 0 ? null : new Error('exit code' + code)

        console.log(err)
    })

    // ---> 接收爬取的video数据,保存到 movie上
    child.on('message', async data => {
        let doubanId = data.doubanId
        let movie = await Movie.findOne({
            doubanId: doubanId
        })

        if (data.video) {
            movie.video = data.video
            movie.cover = data.cover

            await movie.save()
        } else {
            // ---> movie没有video则删除moive和分类中的 movie
            await movie.remove()

            let movieTypes = movie.movieTypes

            for (let i = 0; i < movieTypes.length; i++) {
                let type = movieTypes[i]
                let cat = await Category.findOne({
                    name: type
                })

                if (cat && cat.movie) {
                    let idx = cat.movies.indexOf(movie._id)

                    if (idx > -1) {
                        cat.movies = cat.movies.splice(idx, 1)
                    }

                    await cat.save()
                }
            }
        }

    })
    child.send(movies)
})()