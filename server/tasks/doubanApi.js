const rp = require('request-promise-native')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/${item.doubanId}`
    const res = await rp(url)

    let body

    try {
        body = JSON.parse(res)
    } catch (err) {
        console.log(err)
    }

    return body
}

;(async () => {
    let movies = [{ doubanId: 1295644,
            title: '这个杀手不太冷',
            rate: 9.4,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p511118051.jpg' },
          { doubanId: 26325320,
            title: '血战钢锯岭',
            rate: 8.7,
            poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2398141939.jpg' },
          { doubanId: 2129039,
            title: '飞屋环游记',
            rate: 8.9,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2364094053.jpg' }]

    movies.map(async movie => {
        let movieData = await fetchMovie(movie)

        console.log(movieData)
    })
})()