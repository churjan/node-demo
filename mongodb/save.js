const StudentModel = require('./model/StudentModel')

let studentDoc = new StudentModel({
  name: 'churjan',
  age: 26
})
studentDoc.save().then(doc => {
  console.log(doc)
})
