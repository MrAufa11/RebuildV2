const express = require('express');
const router = express.Router();
const ReligionController = require('../controllers/ReligionController');

router.get('/', ReligionController.getAll);
router.get('/:id', ReligionController.getById);
router.post('/', ReligionController.create);
router.put('/:id', ReligionController.update);
router.delete('/:id', ReligionController.delete);

module.exports = router;
