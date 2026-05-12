const express = require('express');
const router = express.Router();
const StudentPaymentController = require('../../controllers/StudentPaymentController');
const verifyToken = require('../../../../core/middleware/verifyToken');

/**
 * ==========================================
 * TRANSATIONAL PAYMENT ROUTES (Daftar Ulang)
 * ==========================================
 */

/**
 * @route   POST /api/spmb/student/payments/re-registration-payment
 * @desc    Submit new payment installment for re-registration
 * @access  Private (Student)
 */
router.post('/re-registration-payment', verifyToken, StudentPaymentController.submitPayment);

/**
 * @route   GET /api/spmb/student/payments/re-registration-payments/:student_id
 * @desc    Get all payment history for a specific student
 * @access  Private (Student/Admin)
 */
router.get('/re-registration-payments/:student_id', verifyToken, StudentPaymentController.getPayments);

/**
 * @route   GET /api/spmb/student/payments/re-registration-payment/:id
 * @desc    Get details of a single payment by ID
 * @access  Private (Student)
 */
router.get('/re-registration-payment/:id', verifyToken, StudentPaymentController.getPaymentById);

/**
 * @route   PUT /api/spmb/student/payments/re-registration-payment/:id
 * @desc    Update an existing (pending) payment
 * @access  Private (Student)
 */
router.put('/re-registration-payment/:id', verifyToken, StudentPaymentController.updatePayment);

/**
 * @route   DELETE /api/spmb/student/payments/re-registration-payment/:id
 * @desc    Delete a pending payment
 * @access  Private (Student)
 */
router.delete('/re-registration-payment/:id', verifyToken, StudentPaymentController.deletePayment);

/**
 * @route   GET /api/spmb/student/payments/re-registration-payment/stats/:student_id
 * @desc    Get payment summary statistics for a student
 * @access  Private (Student/Admin)
 */
router.get('/re-registration-payment/stats/:student_id', verifyToken, StudentPaymentController.getPaymentStats);

/**
 * ==========================================
 * INITIAL REGISTRATION FEE ROUTES (Formulir)
 * ==========================================
 */

/**
 * @route   POST /api/spmb/student/payments/re-registration-payments-form
 * @desc    Submit initial registration fee (Updates Registrants table)
 * @access  Private (Student)
 */
router.post('/re-registration-payments-form', verifyToken, StudentPaymentController.submitPaymentForm);

/**
 * @route   POST /api/spmb/student/payments/
 * @desc    Alias for initial registration fee submission
 */
router.post('/', verifyToken, StudentPaymentController.submitPaymentForm);

/**
 * ==========================================
 * ADMIN ONLY ROUTES
 * ==========================================
 */

/**
 * @route   PUT /api/spmb/student/payments/re-registration-payment/:id/verify
 * @desc    Verify or reject a payment installment (Admin only)
 * @access  Private (Admin)
 */
router.put('/re-registration-payment/:id/verify', verifyToken, StudentPaymentController.verifyPayment);

/**
 * ==========================================
 * UTILITY ROUTES
 * ==========================================
 */

/**
 * @route   GET /api/spmb/student/payments/
 * @desc    Get all payments for current student (via student_id query param)
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const studentId = req.query.student_id || req.userId;
        if (!studentId) {
            return res.status(400).json({ message: 'student_id is required' });
        }
        // Inject into params for getPayments
        req.params.student_id = studentId;
        return StudentPaymentController.getPayments(req, res);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
