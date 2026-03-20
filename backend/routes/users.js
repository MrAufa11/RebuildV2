const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
// Routes are protected globally in index.js

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getOne);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
