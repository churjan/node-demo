const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

//拿post里面body的值 ctx.request.body
app.use(bodyparser())
// //////////////////////////////////////////////////////////
//错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 响应用户
    ctx.status = error.statusCode || error.status || 500
    ctx.body = error

    // 触发应用层级错误事件
    console.log('捕获到错误:', error.message)
  }
})
//设置跨域
app.use(async (ctx, next) => {
  const whiteList = ['http://127.0.0.1:5500']
  if (
    ctx.request.header.origin !== ctx.origin &&
    whiteList.includes(ctx.request.header.origin)
  ) {
    ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
    )
    ctx.set('Access-Control-Allow-Credentials', true)
  }
  await next()
})

app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'PUT,PATCH,DELETE,POST,GET')
    ctx.set('Access-Control-Max-Age', 3600 * 24)
    ctx.body = ''
  }
  await next()
})

// //////////////////////////////////////////////////////////

router.post('/user/info', async (ctx, next) => {
  ctx.body = {
    success: true,
    data: {
      name: 'Churjan',
      age: 26
    }
  }
})

app.use(static(__dirname + '/public'))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
