const Joi = require('joi')
const encryptPassword = require('../../utils/encrypt')

const customJoi = Joi.extend({
  base: Joi.string().min(6),
  name: 'hash',

  language: {
    encrypt: 'can\'t encrypt empty value'
  },

  rules: [
    {
      name: 'encrypt',

      // eslint-disable-next-line
      validate (params, value, state, options) {
        return encryptPassword(value)
      }
    }
  ]
})

const logInFromCms = Joi.object().keys({
  email: Joi.string().email().required(),
  password: customJoi.hash().encrypt().required()
})

const signUpFromMobile = Joi.object().keys({
  email: Joi.string().email().required(),
  password: customJoi.hash().encrypt().required()
})

const logInFromMobile = logInFromCms.keys({
  deviceId: Joi.string().required(),
  deviceToken: Joi.string().required()
})

module.exports = {
  logInFromCms,
  signUpFromMobile,
  logInFromMobile
}
