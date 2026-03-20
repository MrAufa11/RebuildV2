const { User, Role, Sequelize } = require('../models');
const { Op } = Sequelize;
const bcrypt = require('bcrypt');
const { generateAndSaveToken } = require('../utils/tokenUtils');

const AuthController = {
    async login(req, res) {
        try {
            const { username, password, app_type, login_type = 'admin' } = req.body;
            const { App, StudentUser } = require('../models');

            let user;
            if (login_type === 'student') {
                // Login for Calon Siswa (StudentUser in SPMB DB)
                user = await StudentUser.findOne({
                    where: {
                        [Op.or]: [
                            { username: username },
                            { email: username }
                        ]
                    }
                });

                if (!user) {
                    return res.status(404).json({ message: 'Akun Calon Siswa tidak ditemukan' });
                }

                if (!user.isActive) {
                    return res.status(403).json({ message: 'Akun tidak aktif' });
                }

                // Verify password
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ message: 'Password salah' });
                }

                // Generate Token for Student
                // We fake a role object for consistency in token generation utility if needed,
                // or update generateAndSaveToken to handle user without role object but with app_type
                user.role = { id: 0, name: 'Calon Siswa' }; // Mock role for payload compatibility
            } else {
                // Login for Admin (User in Master DB)
                user = await User.findOne({
                    where: {
                        [Op.or]: [
                            { username: username }, // Check username
                            { email: username }     // Check email
                        ]
                    },
                    include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name', 'app_id'],
                        include: [{ model: App, as: 'app' }]
                    }]
                });

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Check App Access if app_type is provided (for specific admin apps)
                if (app_type && app_type !== 'spmb') {
                    const targetApp = await App.findOne({ where: { code: app_type } });
                    if (!targetApp) {
                        return res.status(400).json({ message: 'Invalid App Type' });
                    }
                    if (user.role && user.role.app_id && user.role.app_id !== targetApp.id) {
                        return res.status(403).json({ message: `Access Denied for ${app_type}` });
                    }
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ message: 'Wrong password' });
                }
            }

            const accessToken = await generateAndSaveToken(user, app_type, login_type);

            // Determine cookie security based on CORS_ORIGIN protocol
            const isHttps = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.startsWith('https');
            const isProduction = process.env.NODE_ENV === 'production';

            const cookieName = login_type === 'admin' ? 'adminToken' : 'studentToken';

            res.cookie(cookieName, accessToken, {
                httpOnly: true,
                secure: isProduction && isHttps,
                sameSite: isProduction && isHttps ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                message: 'Login successful',
                accessToken: accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role ? user.role.name : 'Calon Siswa'
                }
            });
        } catch (error) {
            // console.error('Login Error:', error);
            return res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    },

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const salt = await bcrypt.genSalt(16);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role_id: req.body.role_id
            });

            return res.status(201).json({
                message: 'User registered successfully',
                data: newUser
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },

    async logout(req, res) {
        try {
            const { Token, SpmbToken } = require('../models');

            // Revoke all tokens for this user
            // Assuming req.userId is set by the verifyToken middleware
            if (req.userId) {
                if (req.loginType === 'student') {
                    await SpmbToken.destroy({
                        where: { student_id: req.userId }
                    });
                } else {
                    await Token.destroy({
                        where: { user_id: req.userId }
                    });
                }
            }

            const cookieToClear = req.loginType === 'student' ? 'studentToken' : 'adminToken';
            res.clearCookie(cookieToClear);
            // Additionally clear the legacy accessToken cookie to ensure clean state
            res.clearCookie('accessToken');
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            // console.error('Error logging out:', error);
            return res.status(500).json({ message: 'Error logging out', error: error.message });
        }
    },

    async me(req, res) {
        try {
            const { App, Menu, RoleMenuPermissions, StudentUser } = require('../models');

            // Handle SPMB Student (Calon Siswa)
            if (req.loginType === 'student') {
                const student = await StudentUser.findByPk(req.userId, {
                    attributes: ['id', 'username', 'email', 'isActive']
                });

                if (!student) {
                    return res.status(404).json({ message: 'Student not found' });
                }

                return res.status(200).json({
                    id: student.id,
                    username: student.username,
                    email: student.email,
                    role: {
                        name: 'Calon Siswa',
                        permissions: [], // Students might not need dynamic permissions yet
                        menus: []
                    }
                });
            }

            // Handle Admin User (Master DB)
            let menuFilter = {};
            if (req.query.app_type) {
                const targetApp = await App.findOne({ where: { code: req.query.app_type } });
                if (targetApp) {
                    menuFilter = { app_id: targetApp.id };
                }
            }

            const user = await User.findByPk(req.userId, {
                attributes: ['id', 'username', 'email'],
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name'],
                    include: [{
                        model: Menu,
                        as: 'menus',
                        where: menuFilter,
                        required: false,
                        attributes: ['id', 'label', 'url', 'icon', 'order', 'parent_id', 'app_id'],
                        through: {
                            attributes: ['can_view', 'can_create', 'can_update', 'can_delete']
                        }
                    }]
                }]
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Transform permissions
            let permissions = [];
            let menus = [];

            if (user.role && user.role.menus) {
                user.role.menus.sort((a, b) => a.order - b.order);

                user.role.menus.forEach(menu => {
                    const slug = menu.label.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]+/g, '')
                        .replace(/\-\-+/g, '-')
                        .replace(/^-+/, '')
                        .replace(/-+$/, '');

                    const perms = menu.RoleMenuPermissions;
                    if (perms) {
                        if (perms.can_view) permissions.push(`${slug}.read`);
                        if (perms.can_create) permissions.push(`${slug}.create`);
                        if (perms.can_update) permissions.push(`${slug}.update`);
                        if (perms.can_delete) permissions.push(`${slug}.delete`);
                    }

                    if (perms && perms.can_view) {
                        menus.push({
                            id: menu.id,
                            label: menu.label,
                            url: menu.url,
                            icon: menu.icon,
                            order: menu.order,
                            parent_id: menu.parent_id,
                        });
                    }
                });
            }

            const userJson = user.toJSON();
            if (userJson.role) {
                userJson.role.permissions = permissions;
                userJson.role.menus = menus;
            }

            return res.status(200).json(userJson);
        } catch (error) {
            // console.error('Error in me:', error);
            return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
        }
    }
};

module.exports = AuthController;
