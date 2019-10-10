const { responseSender } = require('../../../utils')

module.exports = async (req, res) => {
  res.setHeader('x-auth-token', req.token)

  const data = {
    ...req.auth,
    jwtToken: req.token,
  }

  responseSender.success(res, data)
}
