const express = require('express');
const router = express.Router();
const TokenController = require('../controllers/TokenController');

router.get('/generate', TokenController.generateToken);
module.exports = router;