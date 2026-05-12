const express = require('express');
const router = express.Router();
const BuildingSetupController = require('../controllers/BuildingSetupController');

router.get('/', BuildingSetupController.getAll);
router.get('/:id', BuildingSetupController.getById);
router.post('/', BuildingSetupController.create);
router.put('/:id', BuildingSetupController.update);
router.delete('/:id', BuildingSetupController.delete);

module.exports = router;
