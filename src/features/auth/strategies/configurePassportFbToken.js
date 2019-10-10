const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')
const UserModel = require('../../user/model')
const config = require('../../../config')

module.exports = function() {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        fbGraphVersion: config.facebook.apiVersion,
      },

      async (accessToken, refreshToken, profile, done) => {
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
