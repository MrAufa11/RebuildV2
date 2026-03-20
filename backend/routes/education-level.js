const express = require('express');
const router = express.Router();
const EducationLevelController = require('../controllers/EducationLevelController');

router.get('/', EducationLevelController.getAll);
router.get('/:id', EducationLevelController.getById);
router.post('/', EducationLevelController.create);
router.put('/:id', EducationLevelController.update);
router.delete('/:id', EducationLevelController.delete);

module.exports = router;
