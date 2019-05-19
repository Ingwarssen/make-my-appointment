const mongoose = require('mongoose')
const {USER_STATUS} = require('../../constants')

// const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = new mongoose.Schema({
  phone: {
    type     : String,
    trim     : true,
    lowercase: true,
    unique   : true
  },

  email: {
    type  : String,
    unique: true
  },

  facebookId: {
    type: String
  },

  token: {
    type: String
  },

  birthday: {
    type   : Date,
    default: (new Date()).toUTCString()
  },

  updatedUtc: {
    type   : Date,
    default: (new Date()).toUTCString()
  },

  cratedUtc: {
    type   : Date,
    default: (new Date()).toUTCString()
  },

  status: {
    type   : String,
    default: USER_STATUS.REGISTERED,
    enum   : [
      USER_STATUS.ACTIVE,
      USER_STATUS.DISABLED,
      USER_STATUS.REGISTERED
    ]
  }
}, {
  versionKey: false,
  autoIndex : false,
  collection: 'users'
})

module.exports = Schema
