const User = require('../models/User')

const getUser = userId => {
  return User.find({ _id: userId })
}

const addUser = (...args) => {
  return new User({
    _id: args[0],
    refreshToken: args[1],
    events: []
  })
}

const updateUserStatus = (...args) => {
  return User.findOneAndUpdate({ _id: args[0] }, { refreshToken: args[1] })
}

const updateUserEvents = (...args) => {
  return User.update({ _id: args[0] }, { $push: { events: args[1] } })
}

module.exports = {
  getUser,
  addUser,
  updateUserStatus,
  updateUserEvents
}
