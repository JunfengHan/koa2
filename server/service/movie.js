const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const getAllMovies = async (type, year) => {
    let query = {}

    if (type) {
        query.movieTypes = {
            $in: [type]
        }
    }

    if (year) {
        query.year = year
    }

    const movies = await movies.find(query)

    return movies
}

const getMovieDetail = async (id) => {
    const movie = await Movie.findOne({ _id: id})
    
    return movie
}

const getRelativeMovies = async (movie) => {
    const movies = await Movie.findOne({ 
        movieTypes: {
            $in: movie.movieTypes
        }
    })
    
    return movies
}

exports.getAllMovies = getAllMovies
exports.getMovieDetail = getMovieDetail
exports.getRelativeMovies = getRelativeMovies
