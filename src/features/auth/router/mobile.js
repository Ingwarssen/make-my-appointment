const express = require('express')

const router = express.Router()

router.get('/', require('../methods/isAuth'))

router.post(
  '/facebook',
  require('../methods/passportAuth'),
  require('../methods/authCheck'),
  require('../methods/generateToken'),
  require('../methods/sendToken')
)

router.get('/facebook/callback')
router.get('/me', require('../methods/authenticate'), require('../../user/methods/getCurrentUser'))

router.get('/settings', require('../methods/settings'))

router.get('/logout', require('../methods/logout'))
router.post('/logout', require('../methods/logout'))
router.post('/signUp', require('../methods/signUpFromMobile'))

router.post('/logIn', require('../methods/loginFromMobile'))

module.exports = router
