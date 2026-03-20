const express = require('express');
const router = express.Router();
const OccupationController = require('../controllers/OccupationController');

router.get('/', OccupationController.getAll);
router.get('/:id', OccupationController.getById);
router.post('/', OccupationController.create);
router.put('/:id', OccupationController.update);
router.delete('/:id', OccupationController.delete);

module.exports = router;
