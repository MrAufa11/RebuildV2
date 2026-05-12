const express = require('express');
const router = express.Router();

// Keuangan module routes - Financial management
const feeRoutes = require('./routes/fee');
const uploadRoutes = require('./routes/upload');

// Public route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Keuangan API' });
});

// Keuangan routes
router.use('/fee', feeRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
