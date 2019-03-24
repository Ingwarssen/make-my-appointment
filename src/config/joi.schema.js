const Joi = require('joi')

const defUserObj = Joi.object().keys({
  email   : Joi.string().email().required(),
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
  workingDirectory: Joi.string().required()
}).unknown().required()

module.exports = schema
