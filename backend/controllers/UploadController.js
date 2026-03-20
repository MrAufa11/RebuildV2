const fs = require('fs');

const UploadController = {
    async upload(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const filePath = req.file.path;

            // Security Check: Magic Numbers
            // Read first 12 bytes to cover JPEG, PNG, and WebP (RIFF....WEBP)
            const buffer = Buffer.alloc(12);
            const fd = fs.openSync(filePath, 'r');
            fs.readSync(fd, buffer, 0, 12, 0);
            fs.closeSync(fd);

            const hex = buffer.toString('hex').toUpperCase();
            let isValid = false;

            // Check signatures
            // JPEG: FF D8 FF
            if (hex.startsWith('FFD8FF')) {
                isValid = true;
            }
            // PNG: 89 50 4E 47 0D 0A 1A 0A
            else if (hex.startsWith('89504E470D0A1A0A')) {
                isValid = true;
            }
            // WebP: RIFF (bytes 0-3) ... WEBP (bytes 8-11)
            // 52 49 46 46 (0-3 in hex) -> RIFF
            // 57 45 42 50 (8-11 in hex) -> WEBP
            else if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') {
                isValid = true;
            }

            if (!isValid) {
                fs.unlinkSync(filePath); // Delete invalid file
                return res.status(400).json({ message: 'Invalid file content. Not a valid image.' });
            }

            // We serve /public statically or the frontend proxy handles it
            const appType = req.appType || 'website';
            const fileUrl = `/public/${appType}/${req.file.filename}`;

            return res.status(200).json({
                message: 'File uploaded successfully',
                url: fileUrl,
                filename: req.file.filename
            });

        } catch (error) {
            // Clean up if error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({ message: 'Error uploading file', error: error.message });
        }
    }
};

module.exports = UploadController;
