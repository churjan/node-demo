// const express = require('express')
const express = require('./kpress')
const app = express()
app.get('/', (req, res) => {
  res.end('Hello world')
})
app.get('/users', (req, res) => {
  res.end(JSON.stringify({ name: 'churjan', age: 26 }))
})
app.listen(3000, () => {
  console.log('App listen 3000')
})
