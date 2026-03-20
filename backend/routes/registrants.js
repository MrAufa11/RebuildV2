const express = require('express');
const router = express.Router();
const RegistrantController = require('../controllers/RegistrantController');
const verifyToken = require('../middleware/verifyToken');

const PdfController = require('../controllers/PdfController');

// Public route for new applicants
router.post('/register', RegistrantController.create);

// Protected routes (for admin / students)
const SpmbDashboardController = require('../controllers/SpmbDashboardController');
router.get('/dashboard-stats', verifyToken, SpmbDashboardController.getSpmbStats);

router.get('/me', verifyToken, RegistrantController.getMe);
router.get('/me/pdf/card', verifyToken, PdfController.generateCard);
router.get('/me/pdf/graduation', verifyToken, PdfController.generateGraduation);

router.get('/', verifyToken, RegistrantController.getAll);
router.get('/:id', verifyToken, RegistrantController.getOne);
router.get('/:id/pdf/card', verifyToken, PdfController.generateCard);
router.get('/:id/pdf/graduation', verifyToken, PdfController.generateGraduation);
router.put('/:id', verifyToken, RegistrantController.update);
router.put('/:id/status', verifyToken, RegistrantController.updateStatus);
router.delete('/:id', verifyToken, RegistrantController.delete);

module.exports = router;
