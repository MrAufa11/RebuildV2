const express = require('express');
const router = express.Router();
const VoucherController = require('../controllers/VoucherController');

router.get('/', VoucherController.getAll);
router.get('/:id', VoucherController.getById);
router.post('/', VoucherController.create);
router.put('/:id', VoucherController.update);
router.delete('/:id', VoucherController.delete);
router.post('/verify-voucher', VoucherController.verifyVoucher);

module.exports = router;
