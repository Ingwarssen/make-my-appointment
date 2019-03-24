const express = require('express')
const {access} = require('../../../utils')
const MODULES = require('../../../constants/acl/modules')

const router = express.Router()

router.get('/user',
  access.middleware(MODULES.USERS.id, 'read'),
  require('../../user/methods/getUserFilters')
)

module.exports = router
