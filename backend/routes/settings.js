const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/SettingController');

const verifyToken = require('../middleware/verifyToken');

router.get('/', SettingController.getAllPublic);

// Protected routes
router.put('/', verifyToken, SettingController.update);

module.exports = router;
