const express = require('express');
const router = express.Router();
const PositionController = require('../controllers/PositionController');

router.get('/', PositionController.getAll);
router.get('/:id', PositionController.getById);
router.post('/', PositionController.create);
router.put('/:id', PositionController.update);
router.delete('/:id', PositionController.delete);

module.exports = router;
