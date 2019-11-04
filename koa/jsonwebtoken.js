const jsonwebtoken = require('jsonwebtoken')
const secret = 'secret'
const user = {
  username: 'abc',
  password: '111111'
}

const token = jsonwebtoken.sign(
  {
    data: user,
    // 设置 token 过期时间
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  },
  secret
)

console.log('生成token:' + token)
console.log('解码:', jsonwebtoken.verify(token, secret))
