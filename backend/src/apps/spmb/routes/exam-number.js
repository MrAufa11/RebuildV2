const express = require('express');
const router = express.Router();
const ExamNumberController = require('../controllers/ExamNumberController');

router.get('/', ExamNumberController.getAll);
router.get('/:id', ExamNumberController.getById);
router.post('/', ExamNumberController.create);
router.put('/:id', ExamNumberController.update);
router.delete('/:id', ExamNumberController.delete);

module.exports = router;
