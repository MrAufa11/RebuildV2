const express = require('express');
const router = express.Router();

// Master module routes - Core system management (users, roles, auth, etc.)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const menuRoutes = require('./routes/menus');
const roleRoutes = require('./routes/roles');
const permissionRoutes = require('./routes/permissions');

// Public route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Master API' });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes (token verification handled in main index.js)
router.use('/users', userRoutes);
router.use('/tokens', tokenRoutes);
router.use('/menus', menuRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

module.exports = router;
