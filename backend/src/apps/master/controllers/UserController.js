const { User, Role, Token } = require('../models');
const bcrypt = require('bcrypt');

const UserController = {
    async create(req, res) {
        try {
            const { username, email, password, role_id } = req.body;
            const salt = await bcrypt.genSalt(16);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.findOne({ where: { username } });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role_id
            });

            return res.status(201).json({
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const users = await User.findAll({
                include: [{ model: Role, as: 'role', attributes: ['name'] }]
            });
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                include: [{ model: Role, as: 'role', attributes: ['name'] }]
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { username, email, role_id } = req.body;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.update({ username, email, role_id });

            return res.status(200).json({
                message: 'User updated successfully',
                data: user
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.destroy();
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    }
};

module.exports = UserController;
