const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../validators/validate');
const { signupValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
