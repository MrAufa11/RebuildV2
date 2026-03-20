const express = require('express');
const router = express.Router();
const RegistrationBatchController = require('../controllers/RegistrationBatchController');

router.get('/', RegistrationBatchController.getAll);
router.get('/:id', RegistrationBatchController.getById);
router.post('/', RegistrationBatchController.create);
router.put('/:id', RegistrationBatchController.update);
router.delete('/:id', RegistrationBatchController.delete);

module.exports = router;
