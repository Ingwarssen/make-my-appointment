const mongoose = require('mongoose')
const Schema = require('./mongoose.schema')

const Model = mongoose.model('AccessRole', Schema)

module.exports = {
  Origin: Model,

  create(data) {
    return Model.create(data)
  },

  updateOne(query, modify, opt) {
    return Model.findOneAndUpdate(query, modify, opt)
  },

  getOne(query) {
    return Model.findOne(query, { _id: 1, name: 1, level: 1 })
      .lean()
      .exec()
  },
}
