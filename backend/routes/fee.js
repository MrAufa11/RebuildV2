const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/FeeController');

router.get('/', FeeController.getAll);
router.get('/:id', FeeController.getById);
router.post('/', FeeController.create);
router.put('/:id', FeeController.update);
router.delete('/:id', FeeController.delete);

module.exports = router;
