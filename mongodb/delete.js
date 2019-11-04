const StudentModel = require('./model/StudentModel')

StudentModel.deleteOne({ name: 'zhangsan' }).then(result => {
  console.log(result)
})
// StudentModel.deleteMany({ name: 'zhangsan' }).then(result => {
//   console.log(result)
// })
