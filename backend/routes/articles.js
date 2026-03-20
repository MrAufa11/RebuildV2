const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');

const verifyToken = require('../middleware/verifyToken');

router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.getOne);

// Protected routes
router.post('/', verifyToken, ArticleController.create);
router.put('/:id', verifyToken, ArticleController.update);
router.delete('/:id', verifyToken, ArticleController.delete);

module.exports = router;
