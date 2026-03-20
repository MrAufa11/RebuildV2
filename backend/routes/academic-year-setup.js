const express = require('express');
const router = express.Router();
const AcademicYearSetupController = require('../controllers/AcademicYearSetupController');

router.get('/', AcademicYearSetupController.getAll);
router.get('/:id', AcademicYearSetupController.getById);
router.post('/', AcademicYearSetupController.create);
router.put('/:id', AcademicYearSetupController.update);
router.delete('/:id', AcademicYearSetupController.delete);

module.exports = router;
