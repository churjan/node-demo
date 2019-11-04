// 客户端
const MongoClient = require('mongodb').MongoClient

// 连接URL
const url = 'mongodb://localhost:27017'

// 数据库名
const dbName = 'test'

;(async function() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  //创建链接
  let ret
  ret = await client.connect()

  const db = client.db('test')
  const fruits = db.collection('fruits')

  //添加数据
  // ret = await fruits.insertOne({
  //   name: '芒果',
  //   price: 15
  // })
  // console.log('insert:', JSON.stringify(ret, null, 4))

  //查询数据
  // ret = await fruits.findOne()
  // console.log('find:', JSON.stringify(ret, null, 4))

  //更新
  // ret = await fruits.update(
  //   { name: '芒果' },
  //   {
  //     $set: { name: '苹果' }
  //   }
  // )

  //删除
  // ret = await fruits.deleteOne({ name: '苹果' })
  // ret = await fruits.deleteMany()

  client.close()
})()
