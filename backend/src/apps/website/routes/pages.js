const express = require('express');
const router = express.Router();
const PageController = require('../controllers/PageController');

const verifyToken = require('../../../core/middleware/verifyToken');

// Public route
router.get('/slug/:slug', PageController.findBySlug);

// Protected routes (Admin)
router.get('/', verifyToken, PageController.index);
router.get('/:id', verifyToken, PageController.show);
router.post('/', verifyToken, PageController.create);
router.put('/:id', verifyToken, PageController.update);
router.delete('/:id', verifyToken, PageController.delete);

module.exports = router;
