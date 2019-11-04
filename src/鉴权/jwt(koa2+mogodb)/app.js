const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const md5 = require('crypto-js/md5')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const static = require('koa-static')

const User = require('./model/user.js')
const config = require('./config.js')

const app = new Koa()
const router = new Router()

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(bodyParser())

/**
 * 开启静态服务
 */
app.use(static(__dirname + '/public'))

/**
 * @description 创建用户
 */
router.post('/register', async (ctx, next) => {
  const { username = '', password = '', nickname, age } = ctx.request.body
  if (username === '' || password === '') {
    ctx.status = 401
    return (ctx.body = {
      success: false,
      code: 10000,
      msg: '用户名或者密码不能为空'
    })
  }
  // 先对密码md5
  const md5PassWord = md5(String(password)).toString()
  // 生成随机salt
  const salt = String(Math.random()).substring(2, 10)
  // 加盐再md5
  const saltMD5PassWord = md5(`${md5PassWord}:${salt}`).toString()
  try {
    // 类似用户查找,保存的操作一般我们都会封装到一个实体里面,本demo只是演示为主, 生产环境不要这么写
    const searchUser = await User.findOne({ username })
    if (!searchUser) {
      const user = new User({
        username,
        password: saltMD5PassWord,
        salt,
        nickname: nickname || '匿名',
        age: +age || 16
      })
      const result = await user.save()
      ctx.body = {
        success: true,
        msg: '注册成功'
      }
    } else {
      ctx.body = {
        success: false,
        msg: '已存在同名用户'
      }
    }
  } catch (err) {
    // 一般这样的我们在生成环境处理异常都是直接抛出 异常类, 再有全局错误处理去处理
    ctx.app.emit('error', err, ctx)
    ctx.body = {
      success: false,
      msg: 'serve is mistakes'
    }
  }
})

/**
 * @description 用户登陆
 */
router.post('/login', async (ctx, next) => {
  const { username = '', password = '' } = ctx.request.body
  if (username === '' || password === '') {
    ctx.status = 401
    return (ctx.body = {
      success: false,
      code: 10000,
      msg: '用户名或者密码不能为空'
    })
  }
  // 一般客户端对密码需要md5加密传输过来, 这里我就自己加密处理,假设客户端不加密。
  // 类似用户查找,保存的操作一般我们都会封装到一个实体里面,本demo只是演示为主, 生产环境不要这么写
  try {
    // username在注册时候就不会允许重复
    const searchUser = await User.findOne({ username })
    if (!searchUser) {
      return (ctx.body = {
        success: false,
        msg: '用户不存在'
      })
    }
    // 需要去数据库验证用户密码
    const md5PassWord = md5(String(password)).toString()
    const saltMD5PassWord = md5(`${md5PassWord}:${searchUser.salt}`).toString()
    if (saltMD5PassWord === searchUser.password) {
      // Payload: 负载, 不建议存储一些敏感信息
      const payload = {
        id: searchUser._id
      }
      const token = jwt.sign(payload, config.secret, {
        expiresIn: '2h'
      })
      ctx.body = {
        success: true,
        data: {
          token
        }
      }
    } else {
      ctx.body = {
        success: false,
        msg: '密码错误'
      }
    }
  } catch (err) {
    ctx.app.emit('error', err, ctx)
    ctx.body = {
      success: false,
      msg: 'serve is mistakes'
    }
  }
})

/**
 * @description 获取用户信息
 */
router.post(
  '/getUserInfo',
  async (ctx, next) => {
    // 这里应该抽成一个auth中间件
    const token = ctx.request.headers['token']
    if (token) {
      try {
        const decoded = jwt.verify(token, config.secret)
        ctx.decoded = decoded
        await next()
      } catch (err) {
        ctx.body = {
          success: false,
          msg: 'Token Failed'
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {
        success: false,
        msg: 'need token'
      }
    }
  },
  async (ctx, next) => {
    try {
      const { id } = ctx.decoded
      console.log(ctx.decoded)

      const { username, age, nickname } =
        (await User.findOne({ _id: id })) || {}

      ctx.body = {
        success: true,
        data: { username, age, nickname }
      }
    } catch (err) {
      ctx.app.emit('error', err, ctx)
      ctx.body = {
        success: false,
        msg: 'serve is mistakes'
      }
    }
  }
)

app.use(router.routes())
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})
app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
