const MODULES = require('../../../constants/acl/modules');
const express = require('express');
const { access } = require('../../../utils');

const router = express.Router();

router.get('/list',
  access.middleware(MODULES.ACTIVITY_LOG.id, 'read'),
  require('../methods/getActivity')
);

module.exports = router;
