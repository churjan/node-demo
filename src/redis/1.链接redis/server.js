const redis = require('redis')
const client = redis.createClient(6379, 'localhost')

// client.set('name', 'churjan')
// client.get('name', function(err, v) {
//   console.log('redis key:', v)
// })

client.keys('*', (err, keys) => {
  console.log('keys:', keys)
  keys.forEach(key => {
    client.get(key, (err, val) => {
      console.log(val)
    })
  })
})
