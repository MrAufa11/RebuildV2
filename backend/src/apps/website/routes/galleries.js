const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/GalleryController');

const verifyToken = require('../../../core/middleware/verifyToken');

router.get('/', GalleryController.getAll);
router.get('/:id', GalleryController.getOne);

// Protected routes
router.post('/', verifyToken, GalleryController.create);
router.put('/:id', verifyToken, GalleryController.update);
router.delete('/:id', verifyToken, GalleryController.delete);

module.exports = router;
