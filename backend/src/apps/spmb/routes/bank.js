const express = require('express');
const router = express.Router();
const BankController = require('../controllers/BankController');

router.get('/', BankController.getAll);
router.get('/:id', BankController.getById);
router.post('/', BankController.create);
router.put('/:id', BankController.update);
router.delete('/:id', BankController.delete);

module.exports = router;
