const passport = require('passport')
const { Strategy } = require('passport-facebook')
const UserModel = require('../../user/model')
const config = require('../../../config')

module.exports = function() {
  passport.use(
    new Strategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: '/api/v1/mobile/auth/facebook/callback',
      },
      async function(accessToken, refreshToken, profile, done) {
        const query = { facebookId: profile.id }

        const modify = {
          fullName: profile.displayName,
          email: profile.emails[0].value,
          facebookProvider: {
            id: profile.id,
            token: accessToken,
          },
        }

        const opt = {
          upsert: true,
        }

        let user

        try {
          user = await UserModel.updateOne(query, modify, opt)
        } catch (ex) {
          return done(ex)
        }

        return done(null, user)
      }
    )
  )
}
