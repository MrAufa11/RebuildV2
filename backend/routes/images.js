/**
 * IMAGE ROUTES
 * Secure image serving endpoints
 */

const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/ImageController');

/**
 * @route   GET /api/images/:appType/:filename
 * @desc    Serve image securely
 * @access  Public
 */
router.get('/:appType/:filename', ImageController.serveImage);

module.exports = router;
