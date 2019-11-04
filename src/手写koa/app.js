const KKB = require('./kkb')
const app = new KKB()

// app.use((req, res) => {
//   res.writeHead(200)
//   res.end('hi kaikeba')
// })
app.use(ctx => {
  ctx.body = '开课吧'
})

app.listen(3000, () => {
  console.log('监听端口口3000')
})
