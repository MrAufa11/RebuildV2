const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const verifyToken = require('../../../core/middleware/verifyToken');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/login-as', AuthController.loginAs); // Admin login as student
router.get('/me', verifyToken, AuthController.me);
router.post('/logout', verifyToken, AuthController.logout);

module.exports = router;
