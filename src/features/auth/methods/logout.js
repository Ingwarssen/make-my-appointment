const { logger, responseSender } = require('../../../utils')

// eslint-disable-next-line
module.exports = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    logger.info(`User logged out -- uid: ${req.session.uId}`)
    req.session.destroy()
  }

  responseSender.ok(res)
}
