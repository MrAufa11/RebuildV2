const express = require('express');
const router = express.Router();
const DiscountSetupController = require('../controllers/DiscountSetupController');

router.get('/', DiscountSetupController.getAll);
router.get('/:id', DiscountSetupController.getById);
router.post('/', DiscountSetupController.create);
router.put('/:id', DiscountSetupController.update);
router.delete('/:id', DiscountSetupController.delete);

module.exports = router;
