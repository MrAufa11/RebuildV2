const { User, Role, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAndSaveToken } = require('../utils/tokenUtils');


const TokenController = {
    async generateToken(req, res) {
        try {

            const user = {
                id: 2,
                username: 'admin',
                role: {
                    id: 1
                }
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const token = await generateAndSaveToken(user);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: 'Error generating token', error: error.message });
        }
    }
};
module.exports = TokenController;