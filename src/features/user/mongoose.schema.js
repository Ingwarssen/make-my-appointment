const mongoose = require('mongoose');
const { USER_STATUS } = require('../../constants');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = new mongoose.Schema({
  email: {
    type     : String,
    required : true,
    trim     : true,
    lowercase: true
  },

  password: {
    type    : String,
    required: true
  },

  dateOfJoining: {
    type   : Date,
    default: null
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
});

module.exports = Schema;
