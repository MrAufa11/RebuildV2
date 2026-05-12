const express = require('express');
const router = express.Router();
const ScheduleDetailController = require('../controllers/ScheduleDetailController');

router.get('/', ScheduleDetailController.getAll);
router.get('/:id', ScheduleDetailController.getById);
router.post('/', ScheduleDetailController.create);
router.put('/:id', ScheduleDetailController.update);
router.delete('/:id', ScheduleDetailController.delete);

module.exports = router;
