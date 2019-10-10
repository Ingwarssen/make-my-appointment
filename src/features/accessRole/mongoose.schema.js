const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, default: '' },
    level: { type: Number },
    allowedLoginFromMobile: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    roleAccess: [
      {
        _id: false,
        module: { type: Number, required: true },
        moduleName: { type: String, default: '' },

        cms: {
          _id: false,
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: false },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },

        mobile: {
          _id: false,
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: false },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
  },
  {
    versionKey: false,
    collection: 'access_roles',
  }
)

module.exports = schema
