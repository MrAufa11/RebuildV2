const express = require('express');
const router = express.Router();
const SchoolDataController = require('../controllers/SchoolDataController');

router.get('/', SchoolDataController.getAll);
router.get('/:id', SchoolDataController.getById);
router.post('/', SchoolDataController.create);
router.put('/:id', SchoolDataController.update);
router.delete('/:id', SchoolDataController.delete);

module.exports = router;
