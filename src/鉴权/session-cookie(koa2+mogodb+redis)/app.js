const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session2')
const md5 = require('crypto-js/md5')
const mongoose = require('mongoose')

const static = require('koa-static')
const config = require('./config.js')
const Store = require('./Store.js')
const User = require('./models/user.js')

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
 * 注册用户
 */
router.post('/register', async (ctx, next) => {
  const { username = '', password = '', nickname, age } = ctx.request.body
  if (username === '' || password === '') {
    ctx.status = 401
    return (ctx.body = {
      success: false,
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
    ctx.app.emit('error', err, ctx)
    ctx.body = {
      success: false,
      msg: 'serve is mistakes'
    }
  }
})

/**
 * 登录用户
 */

router.post('/login', async (ctx, next) => {
  const { username = '', password = '' } = ctx.request.body
  if (username === '' || password === '') {
    return (ctx.body = {
      success: false,
      msg: '用户名或者密码不能为空'
    })
  }
  // 一般客户端对密码需要md5加密传输过来, 这里我就自己加密处理,假设客户端不加密。
  // 类似用户查找,保存的操作一般我们都会封装到一个实体里面,本demo只是演示为主, 生产环境不要这么写
  try {
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
      const store = new Store()
      const sid = await store.set(
        {
          id: searchUser._id
        },
        {
          maxAge: 1000 * 60 * 2 // 设定只有120s的有效时间
        }
      )
      ctx.cookies.set('jssessionId', sid)
      ctx.body = {
        success: true,
        msg: '登陆成功'
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
 * 获取用户信息
 */

router.get(
  '/getUserInfo',
  async (ctx, next) => {
    const store = new Store()
    const jssessionId = ctx.cookies.get('jssessionId')
    const userSession = await store.get(jssessionId)
    console.log('获取到请求的cookie', jssessionId, 'session', userSession)
    if (!userSession) {
      ctx.status = 401
      ctx.body = {
        success: false,
        msg: 'oAuth Faill'
      }
    } else {
      ctx.userSession = userSession
      await next()
    }
  },
  async (ctx, next) => {
    try {
      const { id } = ctx.userSession
      const { nickname, age } = await User.findOne({ _id: id })
      ctx.body = {
        success: true,
        data: { nickname, age }
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
