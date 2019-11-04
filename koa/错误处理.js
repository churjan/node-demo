const Koa = require('koa')
const app = new Koa()

//错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 响应用户
    ctx.status = error.statusCode || error.status || 500
    ctx.body = error

    // 触发应用层级错误事件
    ctx.app.emit('error', error, ctx)
    console.log('捕获到错误:', error.message)
  }
})
app.on('error', err => {
  console.log('全局错误事件：', err.message)
})
app.use(async (ctx, next) => {
  ctx.body = 'Welcome!'
})

app.listen(3000)
