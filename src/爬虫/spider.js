const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

for (let i = 100543; i < 100563; i++) {
  const url = `https://www.dy2018.com/i/${i}.html`
  request(url, { encoding: null }, function(err, res, body) {
    console.log(url)
    const html = iconv.decode(body, 'gb2312')
    const $ = cheerio.load(html)
    console.log($('.title_all h1').text())
  })
}
