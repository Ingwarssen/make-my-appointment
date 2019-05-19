const {
  responseSender
} = require('../../../utils')

module.exports = async (req, res) => {
  res.setHeader('x-auth-token', req.token)

  responseSender.success(res, req.auth)
}
