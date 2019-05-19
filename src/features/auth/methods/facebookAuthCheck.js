const {
  responseSender
} = require('../../../utils')

module.exports = async (req, res, next) => {
  if (!req.user) {
    return responseSender.notAuthorized(next)
  }

  // prepare token for API
  req.auth = {
    id: req.user.id
  }

  next()
}
