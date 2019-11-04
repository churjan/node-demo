const Koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')
const cheerio = require('cheerio')
const views = require('koa-views')
const path = require('path')

const app = new Koa()
const router = new Router()

const arr = []
async function fetchList() {
  const url = 'https://s.weibo.com/top/summary?cate=realtimehot'
  const html = await axios.get(url)
  const $ = cheerio.load(html.data)
  $('section ul li a span em').remove()
  $('section ul li a').each(function(index, item) {
    arr.push({
      context: $(this)
        .find('span')
        .text(),
      href: $(this).attr('href')
    })
  })
  console.log(arr)
}

fetchList()

app.use(
  views(__dirname + '/views', {
    extension: 'ejs'
  })
)
app.use(async (ctx, next) => {
  ctx.state.author = '邱健'
  await next() // 继续向下匹配路由
})
router.get('/', async ctx => {
  const title = '爬虫-微博热搜'
  await ctx.render('index', {
    title,
    arr
  })
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(4000)
