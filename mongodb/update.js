const StudentModel = require('./model/StudentModel')

// StudentModel.updateOne({ name: 'zhangsan' }, { age: 26 }).then(result => {
//   console.log(result)
// })
StudentModel.updateMany({ name: 'zhangsan' }, { age: 77 }).then(result => {
  console.log(result)
})
