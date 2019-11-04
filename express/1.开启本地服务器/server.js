const express = require('express')
const app = express()
app.use('/', (req, res) => {
  res.end('Hello world')
})
app.use('/users', (req, res) => {
  res.end(JSON.stringify({ name: 'churjan', age: 26 }))
})
app.listen(3000, () => {
  console.log('App listen 3000')
})
