const JoiOrig = require('joi')
const Joi = JoiOrig.extend(require('joi-phone-number'))

const defUserObj = Joi.object().keys({
  name    : Joi.string().required(),
  phone   : Joi.string().phoneNumber().required(),
  password: Joi.string().required()
}).required()

const schema = Joi.object().keys({
  // storage database
  mongodbUri: Joi.string().required(),

  // common
  host   : Joi.string().required(),
  webHost: Joi.string().required(),
  port   : Joi.number().required(),
  defUser: defUserObj,

  // configuration
  env             : Joi.string().required(),
  isTest          : Joi.boolean().required(),
  isProduction    : Joi.boolean().required(),
  workingDirectory: Joi.string().required(),
  facebook        : {
    appId     : Joi.string().required(),
    appName   : Joi.string().required(),
    apiVersion: Joi.string().required(),
    appSecret : Joi.string().required()
  }
}).unknown().required()

module.exports = schema
