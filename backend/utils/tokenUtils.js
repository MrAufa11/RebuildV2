require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Token, SpmbToken } = require('../models');

const generateAndSaveToken = async (user, app_type = null, login_type = 'admin') => {
    const userId = user.id;
    const username = user.username;
    const roleId = user.role ? user.role.id : user.role_id;

    const payload = {
        userId,
        username,
        roleId,
        appType: app_type,
        loginType: login_type
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    if (login_type === 'student') {
        await SpmbToken.create({
            token: accessToken,
            student_id: userId,
            expires_at: expiresAt,
            is_revoked: false
        });
    } else {
        await Token.create({
            token: accessToken,
            user_id: userId,
            expires_at: expiresAt,
            is_revoked: false
        });
    }

    return accessToken;
};

module.exports = { generateAndSaveToken };
