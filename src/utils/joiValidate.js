const joi = require('joi')

const validate = (payload, schema) => {
  const opt = {
    abortEarly: false,
    convert: true,
    stripUnknown: { arrays: false, objects: true },
  }

  return new Promise((resolve, reject) => {
    joi.validate(payload, schema, opt, (err, value) => {
      if (err) {
        reject(err)
      }
      resolve(value)
    })
  })
}

module.exports = async (payload, schema) => validate(payload, schema)
