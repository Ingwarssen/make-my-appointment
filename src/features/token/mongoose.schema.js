const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = new mongoose.Schema({
  token: {
    type    : String,
    required: true,
    trim    : true
  },

  userId: {
    type    : ObjectId,
    required: true
  },

  createdAt: { type: Date, default: Date.now }
}, {
  autoIndex : false,
  versionKey: false,
  collection: 'tokens'
});

module.exports = Schema;
