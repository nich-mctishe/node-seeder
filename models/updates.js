const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

module.exports = Mongoose.model('updates', new Schema({
  key: { type: String, required: true }
}, {
  timestamps: true
}))
