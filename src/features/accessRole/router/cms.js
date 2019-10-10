const express = require('express')
const { access } = require('../../../utils')

const router = express.Router()

router.get('/list', access.checkAuth, require('../methods/getRoles'))

module.exports = router
