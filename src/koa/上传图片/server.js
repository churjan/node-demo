const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const multer = require('@koa/multer')
const bodyparser = require('koa-bodyparser')
const captcha = require('trek-captcha')

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

// //////////////////////////////////////////////////////////
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images')
  },
  filename: function(req, file, cb) {
    let imgName =
      file.originalname.split('.')[0] +
      '-' +
      Date.now() +
      '.' +
      file.originalname.split('.')[1]
    cb(null, imgName)
  }
})
const upload = multer({ storage: storage })

router.post('/users/upload', upload.single('avatar'), (ctx, next) => {
  console.log('ctx.request.file', ctx.request.file)
  console.log('ctx.file', ctx.file)
  ctx.body = 'done'
})

router.get('/captcha', async ctx => {
  const { token, buffer } = await captcha({ size: 4 })
  ctx.body = buffer
})

app.use(static(__dirname + '/public'))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
