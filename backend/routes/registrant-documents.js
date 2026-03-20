const express = require('express');
const router = express.Router();
const RegistrantDocumentController = require('../controllers/RegistrantDocumentController');

router.get('/registrant/:registrantId', RegistrantDocumentController.getByRegistrant);
router.post('/', RegistrantDocumentController.create);
router.delete('/:id', RegistrantDocumentController.delete);

module.exports = router;
