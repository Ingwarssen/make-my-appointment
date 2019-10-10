const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema(
  {
    originator: {
      type: ObjectId,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    payload: {
      context: {
        type: String,
        required: true,
      },

      _id: {
        type: ObjectId,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: 'activities',
  }
)

module.exports = schema
