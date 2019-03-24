const { webHost } = require('../../../config');
const express = require('express');

const router = express.Router();

// eslint-disable-next-line
router.get('/resetPassword/:token', function (req, res, next) {
  const {
    params: {
      token = ''
    }
  } = req;

  res.render('resetPassword', { webHost, token });
});

// eslint-disable-next-line
router.get('/resetPasswordSuccess', function (req, res, next) {
  res.render('resetPasswordSuccess');
});

module.exports = router;
