const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', function (err) {
        if (invoked) return

        invoked = true
        console.log(err)
    })

    child.on('exit', function (code) {
        if (invoked) return

        invoked = true
        let err = code === 0 ? null : new Error('exit code' + code)

        console.log(err)
    })

    child.on('message', function (data) {
        let result = data.result

        result.forEach(async function(item) {
            let movie = await Movie.findOne({
                doubanId: item.doubanId
            })

            if (!movie) {
                movie = new Movie(item)
                await movie.save()
            }
        })
    })
})()