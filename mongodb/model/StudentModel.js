const mongoose = require('mongoose')
const connection = require('../connection/connection')

const StudentSchema = mongoose.Schema({
  name: String,
  age: Number
})
let StudentModel = connection.model('Student', StudentSchema)

module.exports = StudentModel
