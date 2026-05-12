const jwt = require('jsonwebtoken');
const { Token, SpmbToken } = require('../../../models');

const verifyToken = (req, res, next) => {
    const expectedLoginType = req.headers['x-login-type']; // 'student' or 'admin'

    let token;

    if (req.cookies) {
        if (expectedLoginType === 'student') {
            token = req.cookies.studentToken;
        } else if (expectedLoginType === 'admin') {
            token = req.cookies.adminToken;
        } else {
            token = req.cookies.adminToken || req.cookies.studentToken || req.cookies.accessToken;
        }
    }

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (token == null) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });

        try {
            let dbToken;
            if (decoded.loginType === 'student') {
                dbToken = await SpmbToken.findOne({ where: { token } });
            } else {
                dbToken = await Token.findOne({ where: { token } });
            }

            if (!dbToken) {
                return res.status(403).json({ message: 'Forbidden: Token not found in database' });
            }

            if (dbToken.is_revoked) {
                return res.status(403).json({ message: 'Forbidden: Token has been revoked' });
            }

            const now = new Date();
            if (dbToken.expires_at < now) {
                return res.status(403).json({ message: 'Forbidden: Token has expired' });
            }

            req.username = decoded.username;
            req.userId = decoded.userId;
            req.roleId = decoded.roleId;
            req.appType = decoded.appType;
            req.loginType = decoded.loginType;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

module.exports = verifyToken;
