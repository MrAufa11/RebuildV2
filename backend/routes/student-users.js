const express = require('express');
const router = express.Router();
const StudentUserController = require('../controllers/StudentUserController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, StudentUserController.getAll);

module.exports = router;
