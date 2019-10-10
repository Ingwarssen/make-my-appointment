const passport = require('passport')

module.exports = (req, res, next) => {
  passport.authenticate('facebook-token', { session: false })(req, res, next)
}
