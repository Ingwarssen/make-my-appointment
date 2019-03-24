const mongoose = require('mongoose');
const Schema = require('./mongoose.schema');

const Model = mongoose.model('Token', Schema);

module.exports = {

  Origin: Model,

  removeById(_id) {
    return Model.remove({ _id });
  },

  getOne(options) {
    return Model.findOne(options).lean().exec();
  },

  updateOne(query, modify, opt = {}) {
    return Model.findOneAndUpdate(query, modify, opt).lean().exec();
  }
};

// expires after 2 hours
const indexes = [
  Model.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2 * 60 * 60 })
];

Promise.all(indexes);
