const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');

const verifyToken = require('../../../core/middleware/verifyToken');

router.get('/', BannerController.getAll);
router.get('/:id', BannerController.getOne);

// Protected routes
router.post('/', verifyToken, BannerController.create);
router.put('/:id', verifyToken, BannerController.update);
router.delete('/:id', verifyToken, BannerController.delete);

module.exports = router;
