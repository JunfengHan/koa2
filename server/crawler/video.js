// ---> 爬取视频资源
const puppeteer = require('puppeteer')

const base = 'https://movie.douban.com/subject/'
const doubanId = '1295644'

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

;(async () => {
    console.log('Start visit the target page')

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()
    await page.goto(base + doubanId, {
        waitUntil: 'networkidle2'
    })

    await sleep(1000)

    const result = await page.evaluate(() => {
        var $ = window.$
        var it = $('.related-pic-video')

        if (it && it.length > 0) {
            var link = it.attr('href')
            var cover = it.css('background-image')

            var cover = cover.split('"')[1]

            return {
                link,
                cover
            }
        }

        return {}
    })

    let video

    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        })
        await sleep(2000)

        video = await page.evaluate(() => {
            var $ = window.$
            var it = $('source')

            if (it && it.length > 0) {
                return it.attr('src')
            }

            return ''
        })
    }

    const data = {
        video,
        doubanId,
        cover: result.cover
    }
    browser.close()

    process.send({data})
    process.exit(0)
})()