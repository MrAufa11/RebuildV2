const express = require('express');
const router = express.Router();
const LifeStatusController = require('../controllers/LifeStatusController');

router.get('/', LifeStatusController.getAll);
router.get('/:id', LifeStatusController.getById);
router.post('/', LifeStatusController.create);
router.put('/:id', LifeStatusController.update);
router.delete('/:id', LifeStatusController.delete);

module.exports = router;
