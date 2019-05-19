const express = require('express');
const { access } = require('../../../utils');
const MODULES = require('../../../constants/acl/modules');

const router = express.Router();
// get user list
router.put('/:userId([0-9a-fA-F]{24})',
  access.middleware(MODULES.USERS.id, 'update'),
  require('../methods/upsertFbUser'));

module.exports = router;
