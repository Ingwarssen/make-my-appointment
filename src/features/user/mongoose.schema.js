const mongoose = require('mongoose');
const { USER_STATUS } = require('../../constants');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = new mongoose.Schema({
  name: {
    type    : String,
    required: true,
    trim    : true
  },

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

  nationality: {
    type    : String,
    required: true
  },

  accessRole: {
    type    : Number,
    required: true
  },

  avatar: {
    type   : ObjectId,
    default: null
  },

  lastReadNotificationDate: {
    type   : Date,
    default: new Date()
  },

  dateOfJoining: {
    type   : Date,
    default: null
  },

  status: {
    type   : String,
    default: USER_STATUS.INVITED,
    enum   : [
      USER_STATUS.ACTIVE,
      USER_STATUS.DISABLED,
      USER_STATUS.INVITED
    ]
  },

  createdBy: {
    user: { type: ObjectId, default: null },
    date: { type: Date, default: Date.now }
  },

  editedBy: {
    user: { type: ObjectId, default: null },
    date: { type: Date, default: Date.now }
  }
}, {
  versionKey: false,
  autoIndex : false,
  collection: 'users'
});

module.exports = Schema;
