// ---> 上传视频和封面到七牛
const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')
// const mongoose = require('mongoose')
// const Movie = mongoose.model('Movie')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    let movies = [{ 
        doubanId: 1295644,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p511118051.jpg',
        video: 'http://vt1.doubanio.com/201810121438/06508fec817e38df29522aa34840cbbc/view/movie/M/301080757.mp4',
        cover: 'https://img1.doubanio.com/img/trailer/medium/1433855508.jpg?'
    }]

    movies.map(async movie => {
        if (movie.video && !movie.videoKey) {
            try {
                console.log('开始传 video...')
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                console.log('video上传完成')
                console.log('开始传 cover...')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                console.log('cover上传完成')    
                console.log('开始传 poster...')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
                console.log('poster上传完成')

                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }

                console.log(movie)
                // 返回值
                // 我的七牛测试域名：owxzgbdyh.bkt.clouddn.com，可以去七牛修改为自己的域名
                // 视频图床 http://owxzgbdyh.bkt.clouddn.com/nM1pRBOz4G7rX4rCqNRXR.mp4
                
                /* movie = { doubanId: 1295644,
                    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p511118051.jpg',
                    video: 'http://vt1.doubanio.com/201810121438/06508fec817e38df29522aa34840cbbc/view/movie/M/301080757.mp4',
                    cover: 'https://img1.doubanio.com/img/trailer/medium/1433855508.jpg?',
                    videoKey: 'nM1pRBOz4G7rX4rCqNRXR.mp4',
                    coverKey: 'kjp7bChJUEqzbPQl~yqZg.png',
                    posterKey: 'wu7Oq0CQqK8lbqR61EwvS.png' 
                } */

            } catch (err) {
                console.log(err)
            }
        }
    })

    // let movies = await Movie.find({
    //     $or: [
    //         { videoKey: { $exists: false}},
    //         { videoKey: null },
    //         { videoKey: ''}
    //     ]
    // })

    /* for (let i = 0; i < [movies[0]].length; i++) {
        let movie = movie[i]

        if (movie.video && !movie.videoKey) {
            try {
                console.log('开始传 video')
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                console.log('开始传 cover')
                let converData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                console.log('开始传 poster')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }

                console.log(movie)

                await movie.save()
            } catch (err) {
                console.log(err) 
            }
        }
    } */
})()