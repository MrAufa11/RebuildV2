const express = require('express');
const router = express.Router();
const RegistrationSubPathController = require('../controllers/RegistrationSubPathController');

router.get('/', RegistrationSubPathController.getAll);
router.get('/:id', RegistrationSubPathController.getById);
router.post('/', RegistrationSubPathController.create);
router.put('/:id', RegistrationSubPathController.update);
router.delete('/:id', RegistrationSubPathController.delete);

module.exports = router;
