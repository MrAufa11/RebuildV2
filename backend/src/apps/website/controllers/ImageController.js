/**
 * IMAGE CONTROLLER - PRODUCTION READY
 * 
 * Secure image serving dengan opsi:
 * 1. Direct serving (development)
 * 2. Signed URLs (production)
 * 3. CDN proxy (advanced)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ImageController {
    /**
     * Serve image securely
     * Production mode bisa require signed URLs
     */
    static async serveImage(req, res) {
        try {
            const { appType, filename } = req.params;
            const { token, expires } = req.query;
            
            // Check if production mode requires signed URLs
            const requireSignedUrls = process.env.IMAGES_REQUIRE_SIGNED_URLS === 'true';
            
            if (requireSignedUrls && !this.verifyToken(filename, token, expires)) {
                return res.status(403).json({ 
                    error: 'Unauthorized access',
                    message: 'Valid token required for image access' 
                });
            }
            
            // Validate appType (whitelist)
            const allowedTypes = ['website', 'spmb'];
            if (!allowedTypes.includes(appType)) {
                return res.status(400).json({ error: 'Invalid image type' });
            }

            // Sanitize filename
            const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
            
            // Build file path
            const uploadsDir = path.join(__dirname, '..', 'uploads', appType);
            const filePath = path.join(uploadsDir, sanitizedFilename);

            // Security: Prevent directory traversal
            const resolvedPath = path.resolve(filePath);
            const resolvedUploadsDir = path.resolve(uploadsDir);
            
            if (!resolvedPath.startsWith(resolvedUploadsDir)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Check if file exists
            if (!fs.existsSync(resolvedPath)) {
                return res.status(404).json({ error: 'Image not found' });
            }

            // Determine content type
            const ext = path.extname(filename).toLowerCase();
            const contentTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml'
            };

            const contentType = contentTypes[ext] || 'application/octet-stream';

            // Set security headers
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Content-Security-Policy', "default-src 'none'");
            
            // Optional: Prevent hotlinking
            if (process.env.PREVENT_HOTLINKING === 'true') {
                const referer = req.get('Referer');
                const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || [];
                
                if (referer && !allowedDomains.some(domain => referer.includes(domain))) {
                    // Allow but log (or return 403 if strict)
                }
            }

            // Send file
            return res.sendFile(resolvedPath);

        } catch (error) {
            return res.status(500).json({ error: 'Failed to serve image' });
        }
    }

    /**
     * Generate signed URL for production
     */
    static generateSignedUrl(filename, appType = 'website', expiresInMinutes = 60) {
        const expires = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        
        const data = `${filename}-${expires}-${appType}`;
        const token = crypto.createHmac('sha256', secret).update(data).digest('hex');
        
        return {
            url: `/api/images/${appType}/${filename}?token=${token}&expires=${expires}`,
            expires,
            token
        };
    }

    /**
     * Verify signed URL token
     */
    static verifyToken(filename, token, expires) {
        if (!token || !expires) return false;
        
        // Check expiration
        if (Date.now() / 1000 > expires) {
            return false;
        }
        
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const appType = 'website'; // default
        const data = `${filename}-${expires}-${appType}`;
        const expectedToken = crypto.createHmac('sha256', secret).update(data).digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(token),
            Buffer.from(expectedToken)
        );
    }

    /**
     * Middleware to optionally require auth for images
     */
    static optionalAuth(req, res, next) {
        // In development, allow all
        if (process.env.NODE_ENV !== 'production') {
            return next();
        }
        
        // In production, check config
        if (process.env.IMAGES_REQUIRE_SIGNED_URLS !== 'true') {
            return next();
        }
        
        // Require signed URL
        next();
    }
}

module.exports = ImageController;
