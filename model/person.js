const mongoose = require('mongoose')

const url = process.env.MONGO_DB

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
  const personSchema = new mongoose.Schema({
    name: String,
    number:String
  })
module.exports = mongoose.model('Person', personSchema)