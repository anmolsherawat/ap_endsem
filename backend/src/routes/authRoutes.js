const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;

