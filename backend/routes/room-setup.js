const express = require('express');
const router = express.Router();
const RoomSetupController = require('../controllers/RoomSetupController');

router.get('/', RoomSetupController.getAll);
router.get('/:id', RoomSetupController.getById);
router.post('/', RoomSetupController.create);
router.put('/:id', RoomSetupController.update);
router.delete('/:id', RoomSetupController.delete);

module.exports = router;
