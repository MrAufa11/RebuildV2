const express = require('express');
const router = express.Router();
const NavbarController = require('../controllers/NavbarController');

const verifyToken = require('../middleware/verifyToken');

router.get('/', NavbarController.getAll);
router.get('/:id', NavbarController.getOne);

// Protected routes
router.post('/', verifyToken, NavbarController.create);
router.post('/reorder', verifyToken, NavbarController.reorder);
router.put('/:id', verifyToken, NavbarController.update);
router.delete('/:id', verifyToken, NavbarController.delete);

module.exports = router;
