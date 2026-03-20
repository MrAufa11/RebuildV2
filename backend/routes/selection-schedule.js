const express = require('express');
const router = express.Router();
const SelectionScheduleController = require('../controllers/SelectionScheduleController');

router.get('/', SelectionScheduleController.getAll);
router.get('/:id', SelectionScheduleController.getById);
router.post('/', SelectionScheduleController.create);
router.put('/:id', SelectionScheduleController.update);
router.delete('/:id', SelectionScheduleController.delete);

module.exports = router;
