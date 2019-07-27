const passport = require('passport')

module.exports = (req, res, next) => {
  console.log('auth')
  passport.authenticate(
    'facebook-token', {session: false}
  )(req, res, next)
}
