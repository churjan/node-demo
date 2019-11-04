const mongoose = require('mongoose')
const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
connection.on('open', () => {
  console.log('打开 mongodb 连接')
})
connection.on('err', err => {
  console.log('err:' + err)
})

module.exports = connection
