const express = require('express');
const router = express.Router();
const { signup, verify, login, requestReset, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.get('/verify/:token', verify);
router.post('/login', login);
router.post('/request-reset', requestReset);
router.post('/reset/:token', resetPassword);

module.exports = router;
