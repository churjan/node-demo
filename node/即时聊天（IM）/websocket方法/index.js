const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat-socketio.html')
})

io.on('connection', scoket => {
  console.log('A user connection')
  scoket.on('chat message', msg => {
    console.log('chat message:', msg)
    //广播给所有人
    io.emit('chat message', msg)
    //广播给除发送者外所有人
    // scoket.broadcast.emit('chat message', msg)
  })
  scoket.on('disconnect', () => {
    console.log('user disconneted')
  })
})

http.listen(3000, () => {
  console.log('listen on port:3000')
})
