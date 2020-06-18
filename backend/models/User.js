const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  _id: { type: String, required: true },
  refreshToken: { type: String, required: true },
  events: { type: Array, required: true },
  createdAt: { type: Date, default: new Date() }
})

module.exports = mongoose.model('User', User)
