const cacheControlMiddleware = require('./cacheControlMiddleware')
const encrypt = require('./encrypt')
const errorHandler = require('./errorHandler')
const isApiAvailable = require('./isApiAvailable')
const joiValidate = require('./joiValidate')
const logger = require('./logger')
const mongo = require('./mongo')
const responseSender = require('./responseSender')
const sessionMiddleware = require('./sessionMiddleware')
const pageNotFoundHandler = require('./pageNotFoundHandler')
const setIsMobileMiddleware = require('./setIsMobileMiddleware')
const access = require('./access')
const aggregationHelper = require('./aggregationHelper')
const htmlBuilder = require('./htmlBuilder')

module.exports = {
  cacheControlMiddleware,
  encrypt,
  htmlBuilder,
  errorHandler,
  isApiAvailable,
  joiValidate,
  logger,
  mongo,
  access,
  connection: mongo,
  responseSender,
  sessionMiddleware,
  pageNotFoundHandler,
  setIsMobileMiddleware,
  aggregationHelper,
}
