const http = require('http')
const url = require('url')

const router = []
class Application {
  get(path, handler) {
    router.push({
      path,
      method: 'get',
      handler
    })
    console.log(router)
  }
  listen() {
    const server = http.createServer((req, res) => {
      const { pathname } = url.parse(req.url, true)
      for (const route of router) {
        const { path, method, handler } = route
        if (path === pathname && method === req.method.toLowerCase()) {
          return handler(req, res)
        }
      }
    })
    server.listen(...arguments)
  }
}
module.exports = function createApplication() {
  return new Application()
}
