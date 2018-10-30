const mongoose = require('mongoose')
// ---> 引入装饰器
const { controller, get, post, put } = require('../lib/decorator')

@controller('/api/v0/movies')

router.get('/movies/all', async (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
        'meta.createdAt': -1
    })

    ctx.body = {
        movies
    }
})

router.get('/movies/detail/:id', async (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.findOne({ _id: id})

    ctx.body = {
        movie
    }
})

module.exports = router