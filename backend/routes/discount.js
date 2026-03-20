const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/DiscountController');

router.get('/', DiscountController.getAll);
router.get('/:id', DiscountController.getById);
router.post('/', DiscountController.create);
router.put('/:id', DiscountController.update);
router.delete('/:id', DiscountController.delete);

module.exports = router;
