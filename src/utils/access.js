const _ = require('lodash')

const UserModel = require('../features/user/model')
const responseSender = require('./responseSender')
const logger = require('./logger')

/**
 * Checks if user has access to selected module. Add currentUser property to request object.
 *
 * @function
 * @param {object} req - The input request object
 * @param {number} mid - The module id.
 * @param {string} accessType - The access that should be checked: read, write, etc.
 *
 * @return {boolean} Response that shows if access is allowed or not.
 *
 */
const getAccess = async (req, mid, accessType) => {
  const uid = req.session.uId
  const agentType = req.isMobile ? 'mobile' : 'cms'

  let data
  try {
    data = await UserModel.getAccess(uid, mid)
  } catch (ex) {
    logger.error(`Check access error: ${ex}`)
    throw ex
  }

  const allowed = _.get(data, `access.${agentType}.${accessType}`)
  const currentUser = _.get(data, 'user')

  req = { ...req, currentUser }

  return allowed
}

/**
 * Checks if user is authorized and has access to selected module.
 *
 * @function
 * @param {number} mid - The module id.
 * @param {string} accessType - The access that should be checked: read, write, etc.
 *
 * @returns {function} The standard async middleware function with req, res, next params.
 *
 */
// eslint-disable-next-line
const middleware = (mid, accessType) => {
  return async (req, res, next) => {
    if (!req.session.loggedIn || !req.session.uId) {
      return responseSender.notAuthorized(next)
    }

    let allowed
    try {
      allowed = await getAccess(req, mid, accessType)
    } catch (ex) {
      return responseSender.error(next, ex)
    }

    if (!allowed) {
      return responseSender.forbidden(next)
    }

    next()
  }
}

/**
 * Middleware function that checks if user is authorized
 *
 * @function
 * @param {object} req - The input request object
 * @param {object} res - The output response object
 * @param {function} next - The callback function used in middleware
 * @return {void}
 *
 */
const checkAuth = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    return next()
  }

  responseSender.notAuthorized(next)
}

module.exports = {
  checkAuth,
  middleware,
}
