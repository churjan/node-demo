const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
  const { url, method } = req
  if (url === '/' && method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/users' && method === 'GET') {
    cors(res)
    res.end(JSON.stringify({ name: 'churjan', age: 26 }))
  } else if (url === '/users' && method === 'OPTIONS') {
    cors(res)
    res.end()
  }
})
server.listen(3000)
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')
  res.setHeader('Content-Type', 'text/json')
  res.setHeader('Set-Cookie', 'name=Churjan')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}
