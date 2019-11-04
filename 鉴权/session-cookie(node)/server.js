const http = require('http')

const session = {}
const server = http.createServer((req, res) => {
  const sessionKey = 'sid'
  const { url, method } = req
  if (url === '/favicon.ico') {
    return
  } else {
    const cookie = req.headers.cookie
    if (cookie && cookie.indexOf(sessionKey) > -1) {
      res.end('Come Back')
      const pattern = new RegExp(`${sessionKey}=[^;]+`)
      const sid = pattern.exec(cookie)[0]
      console.log('session:', sid, session, session[sid])
    } else {
      const sid = (Math.random() * 9999999).toFixed()
      res.setHeader('Set-Cookie', `${sessionKey}=${sid};`)
      session[sid] = { name: 'churjan' }
      res.end('hello cookie')
    }
  }
})
server.listen(3000)
