const path = require('path')
const nconf = require('nconf')
const Joi = require('joi')

const validationSchema = require('./joi.schema')

let config = {
  env             : process.env.NODE_ENV,
  isTest          : process.env.NODE_ENV === 'test',
  isProduction    : process.env.NODE_ENV === 'production',
  workingDirectory: path.join(__dirname, '../../')
}

// path to file with credentials
const credentialsPath = path.join(__dirname, `make-my-appointment-credentials${config.env ? `.${config.env}.json` : '.json'}`).normalize()
const envPath = path.join(__dirname, `.env${config.env ? `.${config.env}` : ''}`).normalize()

// loads environment variables from a .env file into process.env
require('dotenv').config({
  path: envPath
})

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'config/credentials.json'

nconf.argv().env().file({
  file: credentialsPath
})

// common
config.host = nconf.get('HOST')
config.spaHost = nconf.get('SPA_HOST')
config.webHost = nconf.get('WEB_HOST')
config.port = parseInt(nconf.get('PORT'), 10)

// storage database
config.mongodbUri = nconf.get('MONGODB_URI')

// admin
config.defUser = {
  name           : nconf.get('DEF_USER_NAME'),
  phone          : nconf.get('DEF_USER_LOGIN'),
  password       : nconf.get('DEF_USER_PASSWORD'),
}

const {
  error,
  value
} = Joi.validate(config, validationSchema, {
  abortEarly: false,
  convert   : true
})

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = value
