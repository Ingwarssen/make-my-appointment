const jwt = require('jsonwebtoken')

const createToken = id => {
  return jwt.sign(
    {id},
    'my-secret',
    {expiresIn: 60 * 120})
}

module.exports = async (req, res, next) => {
  req.token = createToken(req.auth.id)
  next()
}
