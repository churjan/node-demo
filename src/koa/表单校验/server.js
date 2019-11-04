const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const bouncer = require('koa-bouncer')

const app = new Koa()
const router = new Router()

//拿post里面body的值 ctx.request.body
app.use(bodyparser())

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
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

app.use(bouncer.middleware())
const vali = async (ctx, next) => {
  try {
    ctx
      .validateBody('username')
      .required('Username required')
      .isString()
      .trim()
      .isLength(6, 16, '用户名长度为6~16位')
    ctx
      .validateBody('password')
      .required('密码为必填项')
      .isString()
      .isLength(6, 16, '密码必须为6~16位字符')
    await next()
  } catch (err) {
    if (err instanceof bouncer.ValidationError) {
      ctx.body = {
        success: false,
        msg: '校验失败:' + err.message
      }
    } else {
      throw err
    }
  }
}
router.post('/login', vali, async (ctx, next) => {
  ctx.body = {
    success: true,
    data: ctx.vals
  }
})

app.use(static(__dirname + '/public'))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
