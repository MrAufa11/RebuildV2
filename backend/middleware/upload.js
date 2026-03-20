const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Support dynamic paths into public/[appType]/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const appType = req.appType || 'website';
        const publicDir = process.env.PUBLIC_DIR || path.join(__dirname, '../../public');
        const finalUploadDir = path.join(publicDir, appType);

        if (!fs.existsSync(finalUploadDir)) {
            fs.mkdirSync(finalUploadDir, { recursive: true });
        }
        cb(null, finalUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Basic MIME type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
