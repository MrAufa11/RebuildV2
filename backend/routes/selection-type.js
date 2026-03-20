const express = require('express');
const router = express.Router();
const SelectionTypeController = require('../controllers/SelectionTypeController');

router.get('/', SelectionTypeController.getAll);
router.get('/:id', SelectionTypeController.getById);
router.post('/', SelectionTypeController.create);
router.put('/:id', SelectionTypeController.update);
router.delete('/:id', SelectionTypeController.delete);

module.exports = router;
