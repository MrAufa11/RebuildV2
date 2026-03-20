const express = require('express');
const router = express.Router();
const RegistrationPathController = require('../controllers/RegistrationPathController');

router.get('/', RegistrationPathController.getAll);
router.get('/:id', RegistrationPathController.getById);
router.post('/', RegistrationPathController.create);
router.put('/:id', RegistrationPathController.update);
router.delete('/:id', RegistrationPathController.delete);

module.exports = router;
