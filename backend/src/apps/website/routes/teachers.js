const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/TeacherController');

const verifyToken = require('../../../core/middleware/verifyToken');

router.get('/', TeacherController.getAll);
router.get('/:id', TeacherController.getOne);

// Protected routes
router.post('/', verifyToken, TeacherController.create);
router.put('/:id', verifyToken, TeacherController.update);
router.delete('/:id', verifyToken, TeacherController.delete);

module.exports = router;
