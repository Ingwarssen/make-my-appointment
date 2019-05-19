const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get('/', require('../methods/isAuth'))

router.post('/facebook',
  passport.authenticate('facebook-token', {session: false}),
  require('../methods/facebookAuthCheck'),
  require('../methods/generateToken'),
  require('../methods/sendToken'))

router.get('/me',
  require('../methods/authenticate'),
  require('../../user/methods/getCurrentUser'))

router.get('/settings', require('../methods/settings'))

router.get('/logout', require('../methods/logout'))
router.post('/logout', require('../methods/logout'))
router.post('/signUp', require('../methods/signUpFromMobile'))

router.post('/logIn', require('../methods/loginFromMobile'))

module.exports = router
