const http = require('http')
const server = http.createServer((req, res) => {
  const { url, method } = req
  if (url === '/' && method === 'GET') {
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    res.end('你好，访问者')
  }
})
server.listen(3000)
