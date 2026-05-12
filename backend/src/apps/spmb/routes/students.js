const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const verifyToken = require('../../../core/middleware/verifyToken');

router.get('/', verifyToken, StudentController.getAll);

module.exports = router;
