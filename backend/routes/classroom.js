const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/ClassroomController');

router.get('/', ClassroomController.getAll);
router.get('/:id', ClassroomController.getById);
router.post('/', ClassroomController.create);
router.put('/:id', ClassroomController.update);
router.delete('/:id', ClassroomController.delete);

module.exports = router;
