const MODULES = require('../../../constants/acl/modules');
const express = require('express');
const { access } = require('../../../utils');

const router = express.Router();

// get user list
router.get('/list',
  access.middleware(MODULES.USERS.id, 'read'),
  require('../methods/getUsers'));

router.get('/:userId([0-9a-fA-F]{24})',
  access.middleware(MODULES.USERS.id, 'read'),
  require('../methods/getUserById'));

router.put('/:userId([0-9a-fA-F]{24})',
  access.middleware(MODULES.USERS.id, 'update'),
  require('../methods/updateUser'));

// active, disabled, registered
router.put('/status/:userId([0-9a-fA-F]{24})',
  access.middleware(MODULES.USERS.id, 'update'),
  require('../methods/toggleUserStatus'));

router.post('/',
  access.middleware(MODULES.USERS.id, 'create'),
  require('../methods/createUser'));

router.post('/activate',
  access.checkAuth,
  require('../methods/activateAccount'));

router.post('/changePassword',
  access.checkAuth,
  require('../methods/changePassword'));

router.post('/resetPassword/:token', require('../methods/resetPassword'));
router.post('/forgotPassword', require('../methods/forgotPassword'));

module.exports = router;
