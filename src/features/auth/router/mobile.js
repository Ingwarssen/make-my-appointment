const express = require('express');

const router = express.Router();

router.get('/', require('../methods/isAuth'));

router.get('/logout', require('../methods/logout'));
router.post('/logout', require('../methods/logout'));
router.post('/signUp', require('../methods/signUpFromMobile'));

router.post('/logIn', require('../methods/loginFromMobile'));

module.exports = router;
