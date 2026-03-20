const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, StudentController.getAll);

module.exports = router;
