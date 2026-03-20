const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

const verifyToken = require('../middleware/verifyToken');

router.get('/', CategoryController.getAll);

// Protected routes
router.post('/', verifyToken, CategoryController.create);
router.delete('/:id', verifyToken, CategoryController.delete);

module.exports = router;
