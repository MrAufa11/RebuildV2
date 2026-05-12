const express = require('express');
const router = express.Router();

// Minimal stub for registrants route to allow server start.
// TODO: replace with full implementation from admin/student registrants when available.

// Public list (returns empty array)
router.get('/', async (req, res) => {
    return res.status(200).json({ data: [], message: 'Registrants stub' });
});

// Fallback endpoints to avoid 500s from missing routes
router.get('/:id', async (req, res) => {
    return res.status(404).json({ message: 'Registrant not found (stub)' });
});

router.post('/', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented (stub)' });
});

module.exports = router;
