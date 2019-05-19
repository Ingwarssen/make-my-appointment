const expressJwt = require('express-jwt')

module.exports = expressJwt({
  secret         : 'my-secret',
  requestProperty: 'auth',
  getToken (req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }

    return null
  }
})
