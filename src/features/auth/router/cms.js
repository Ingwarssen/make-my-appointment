const express = require('express')

const router = express.Router()

router.get('/', require('../methods/isAuth'))

router.get('/logout', require('../methods/logout'))
router.post('/logout', require('../methods/logout'))

router.post('/logIn', require('../methods/loginFromCms'))

module.exports = router
