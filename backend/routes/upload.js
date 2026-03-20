const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/UploadController');
const upload = require('../middleware/upload');

router.post('/', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            // Check specifically for Multer errors if needed, but generic message is fine
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, UploadController.upload);

module.exports = router;
