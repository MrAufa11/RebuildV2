const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const StudentPaymentController = {
    /**
     * Get all payments for a student
     * GET /student/re-registration-payments/:student_id
     */
    async getPayments(req, res) {
        try {
            const { student_id } = req.params;

            const payments = await spmbDb.query(`
                SELECT 
                    rrp.*,
                    b.bank_name,
                    b.account_number,
                    NULL as bank_account_name,
                    b.recipient_name,
                    fm.fee_name,
                    fm.fee_type
                FROM re_registration_payment rrp
                LEFT JOIN bank b ON rrp.bank_id = b.id
                LEFT JOIN fee fm ON rrp.fee_id = fm.id
                WHERE rrp.student_id = ?
                ORDER BY rrp.created_at DESC
            `, {
                replacements: [student_id],
                type: QueryTypes.SELECT
            });

            return res.json(payments);
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching payment history',
                error: error.message
            });
        }
    },

    /**
     * Get single payment by ID
     * GET /student/re-registration-payment/:id
     */
    async getPaymentById(req, res) {
        try {
            const { id } = req.params;

            const payment = await spmbDb.query(`
                SELECT 
                    rrp.*,
                    b.bank_name,
                    b.account_number,
                    NULL as bank_account_name,
                    b.recipient_name,
                    fm.fee_name,
                    fm.fee_type
                FROM re_registration_payment rrp
                LEFT JOIN bank b ON rrp.bank_id = b.id
                LEFT JOIN fee fm ON rrp.fee_id = fm.id
                WHERE rrp.id = ?
            `, {
                replacements: [id],
                type: QueryTypes.SELECT
            });

            if (!payment || payment.length === 0) {
                return res.status(404).json({
                    message: 'Payment not found'
                });
            }

            return res.json(payment[0]);
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching payment',
                error: error.message
            });
        }
    },

    /**
     * Submit new payment
     * POST /student/re-registration-payment
     */
    async submitPaymentForm(req, res){
        try {
            // 1. Tambahkan "base_amount" (harga asli/awal) untuk di-destructure
            // Pastikan frontend mengirimkan base_amount, atau Anda bisa query (Get) harga awalnya dari DB dulu.
            const {
                student_id,
                payment_date,
                payment_proof,
                voucher_code,
                discountAmount = 0,
                base_amount 
            } = req.body;

            // Validation
            if (!student_id || !payment_proof) {
                return res.status(400).json({
                    message: 'Student ID and payment proof are required',
                    required_fields: ['student_id', 'payment_proof']
                });
            }

            if (!payment_date) {
                return res.status(400).json({
                    message: 'Payment date is required',
                    required_fields: ['payment_date']
                });
            }

            if (base_amount === undefined) {
                return res.status(400).json({
                    message: 'Base amount is required to calculate final payment',
                    required_fields: ['base_amount']
                });
            }

            // 2. Hitung total akhir pembayaran setelah diskon
            // Menggunakan Math.max(0, ...) untuk berjaga-jaga agar total tidak menjadi minus
            const finalPaymentAmount = Math.max(0, base_amount - discountAmount);

            // 3. Masukkan kueri dasar ke dalam Array (Mencegah error koma berlebih di SQL)
            const setClauses = [
                "paymentStatus = 'Unpaid'",
                "status = 'Pending'",
                "paymentProof = :payment_proof",
                "paymentDate = :payment_date",
                "approvedAmount = :final_amount" // Sesuaikan nama kolom DB ini (misal: totalPayment, finalPrice, dll)
            ];

            const replacements = {
                student_id,
                payment_proof,
                payment_date,
                final_amount: finalPaymentAmount // Masukkan nilai yang sudah dihitung ke replacements
            };

            // 4. Kondisi dinamis: Jika voucher_code dikirim
            if (voucher_code) {
                setClauses.push("voucherCode = :voucher_code");
                replacements.voucher_code = voucher_code;
            }

            // 5. Kondisi dinamis: Jika discountAmount lebih dari 0
            if (discountAmount > 0) {
                setClauses.push("discountAmount = :discountAmount");
                replacements.discountAmount = discountAmount;
            }

            // 6. Susun/Gabungkan Array kueri dengan koma dan tambahkan WHERE parameter
            const updateQuery = `
                UPDATE Registrants 
                SET ${setClauses.join(', ')} 
                WHERE id = :student_id
            `;

            // 7. Eksekusi Kueri
            await spmbDb.query(updateQuery, {
                replacements: replacements,
                type: QueryTypes.UPDATE
            });

            // Kembalikan respons sukses beserta info perhitungannya
            return res.status(200).json({
                message: 'Payment proof submitted and Registrant updated successfully',
                payment_details: {
                    base_amount: base_amount,
                    discount_applied: discountAmount,
                    final_total: finalPaymentAmount
                }
            });

        } catch (error) {
            return res.status(500).json({
                message: 'Error updating payment data',
                error: error.message
            });
        }
    },

    /**
     * Submit new payment (For Daftar Ulang installments)
     * POST /student/payments/re-registration-payment
     */
    async submitPayment(req, res) {
        try {
            const {
                student_id,
                fee_id,
                bank_id,
                bank_name,
                account_number,
                amount,
                payment_date,
                payment_proof,
                notes,
                voucher_code,
                discountAmount = 0,
                payment_method = 'Transfer Bank',
                payment_status = 0 // 0 = Pending, 1 = Verified
            } = req.body;

            // Validation
            if (!student_id || !amount || !payment_proof) {
                return res.status(400).json({
                    message: 'Student ID, amount, and payment proof are required',
                    required_fields: ['student_id', 'amount', 'payment_proof']
                });
            }

            if (!payment_date) {
                return res.status(400).json({
                    message: 'Payment date is required',
                    required_fields: ['payment_date']
                });
            }

            // Get user from token (req.userId is set by verifyToken middleware)
            const paid_by_user_id = req.userId || student_id;
            const parsedAmount = parseInt(amount);

            // Insert payment
            const result = await spmbDb.query(`
                INSERT INTO re_registration_payment (
                    student_id,
                    fee_id,
                    bank_id,
                    bank_name,
                    account_number,
                    amount,
                    payment_date,
                    payment_proof,
                    payment_method,
                    notes,
                    paid_by_user_id,
                    payment_status,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, {
                replacements: [
                    student_id,
                    fee_id || null,
                    bank_id || null,
                    bank_name || null,
                    account_number || null,
                    parsedAmount,
                    payment_date,
                    payment_proof,
                    payment_method,
                    notes || '',
                    paid_by_user_id,
                    payment_status
                ],
                type: QueryTypes.INSERT
            });

            // Update registrants with voucher_code, discountAmount, and paymentStatus
            if (voucher_code || discountAmount > 0) {
                await spmbDb.query(`
                    UPDATE Registrants 
                    SET 
                        voucherCode = :voucher_code,
                        discountAmount = :discountAmount,
                        paymentStatus = :paymentStatus,
                    WHERE id = :student_id
                `, {
                    replacements: {
                        voucher_code: voucher_code || null,
                        discountAmount: discountAmount || 0,
                        paymentStatus: 'Unpaid',
                        student_id: student_id
                    },
                    type: QueryTypes.UPDATE
                });
            } else {
                // Update paymentStatus to Unpaid even if no voucher/discount
                await spmbDb.query(`
                    UPDATE Registrants 
                    SET 
                        paymentStatus = :paymentStatus,
                        updated_at = NOW()
                    WHERE id = :student_id
                `, {
                    replacements: {
                        paymentStatus: 'Unpaid',
                        student_id: student_id
                    },
                    type: QueryTypes.UPDATE
                });
            }

            // Get the inserted payment ID
            const insertId = result[0];

            const newPayment = await spmbDb.query(`
                SELECT * FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [insertId],
                type: QueryTypes.SELECT
            });

            return res.status(201).json({
                message: 'Payment submitted successfully',
                data: newPayment[0]
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error submitting payment',
                error: error.message
            });
        }
    },

    /**
     * Update payment
     * PUT /student/re-registration-payment/:id
     */
    async updatePayment(req, res) {
        try {
            const { id } = req.params;
            const {
                fee_id,
                bank_id,
                bank_name,
                account_number,
                amount,
                payment_date,
                payment_proof,
                notes,
                payment_method
            } = req.body;

            // Check if payment exists
            const existingPayment = await spmbDb.query(`
                SELECT * FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [id],
                type: QueryTypes.SELECT
            });

            if (!existingPayment || existingPayment.length === 0) {
                return res.status(404).json({
                    message: 'Payment not found'
                });
            }

            // Update payment
            await spmbDb.query(`
                UPDATE re_registration_payment
                SET 
                    fee_id = ?,
                    bank_id = ?,
                    bank_name = ?,
                    account_number = ?,
                    amount = ?,
                    payment_date = ?,
                    payment_proof = ?,
                    payment_method = ?,
                    notes = ?,
                    updated_at = NOW()
                WHERE id = ?
            `, {
                replacements: [
                    fee_id || existingPayment[0].fee_id,
                    bank_id || existingPayment[0].bank_id,
                    bank_name || existingPayment[0].bank_name,
                    account_number || existingPayment[0].account_number,
                    amount || existingPayment[0].amount,
                    payment_date || existingPayment[0].payment_date,
                    payment_proof || existingPayment[0].payment_proof,
                    payment_method || existingPayment[0].payment_method,
                    notes || existingPayment[0].notes,
                    id
                ],
                type: QueryTypes.UPDATE
            });

            return res.json({
                message: 'Payment updated successfully'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error updating payment',
                error: error.message
            });
        }
    },

    /**
     * Verify payment (admin only)
     * PUT /student/re-registration-payment/:id/verify
     */
    async verifyPayment(req, res) {
        try {
            const { id } = req.params;
            const { 
                payment_status, 
                verified_by,
                rejection_reason 
            } = req.body;

            // Check if payment exists
            const existingPayment = await spmbDb.query(`
                SELECT * FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [id],
                type: QueryTypes.SELECT
            });

            if (!existingPayment || existingPayment.length === 0) {
                return res.status(404).json({
                    message: 'Payment not found'
                });
            }

            const studentId = existingPayment[0].student_id;

            // Update payment status
            await spmbDb.query(`
                UPDATE re_registration_payment
                SET 
                    payment_status = ?,
                    verified_at = ?,
                    verified_by = ?,
                    rejection_reason = ?,
                    updated_at = NOW()
                WHERE id = ?
            `, {
                replacements: [
                    payment_status,
                    payment_status === 1 ? new Date() : null,
                    verified_by || 'Admin',
                    payment_status === 2 ? (rejection_reason || '') : null,
                    id
                ],
                type: QueryTypes.UPDATE
            });

            // After approving a payment, check if all fees are now paid
            if (payment_status === 1) {
                // Get student's registration info to filter fees correctly
                const studentInfo = await spmbDb.query(`
                    SELECT education_level_id, registration_batch_id, registration_path_id
                    FROM Registrants
                    WHERE id = ?
                `, {
                    replacements: [studentId],
                    type: QueryTypes.SELECT
                });

                if (studentInfo && studentInfo[0]) {
                    const { education_level_id, registration_batch_id, registration_path_id } = studentInfo[0];
                    // Get total fees for this student's registration (excluding 'Pendaftaran' type)
                    const totalFeesResult = await spmbDb.query(`
                        SELECT COALESCE(SUM(f.amount), 0) as total_fee
                        FROM fee f
                        WHERE f.fee_type != 'Pendaftaran'
                        AND f.education_level = ?
                        AND f.batch = ?
                        AND f.path = ?
                    `, {
                        replacements: [education_level_id, registration_batch_id, registration_path_id],
                        type: QueryTypes.SELECT
                    });

                    const totalFee = totalFeesResult[0].total_fee || 0;

                    // Get total paid for this student (all approved payments)
                    const totalPaidResult = await spmbDb.query(`
                        SELECT COALESCE(SUM(rrp.amount), 0) as total_paid
                        FROM re_registration_payment rrp
                        WHERE rrp.student_id = ?
                        AND rrp.payment_status = 1
                    `, {
                        replacements: [studentId],
                        type: QueryTypes.SELECT
                    });

                    const totalPaid = totalPaidResult[0].total_paid || 0;


                    // If all fees are paid, update registrant's reRegistrationStatusPayments to 'Paid'
                    if (totalPaid >= totalFee && totalFee > 0) {
                        await spmbDb.query(`
                            UPDATE Registrants
                            SET reRegistrationStatusPayments = 'Paid',
                                updated_at = NOW()
                            WHERE id = ?
                        `, {
                            replacements: [studentId],
                            type: QueryTypes.UPDATE
                        });
                    } else {
                    }
                }
            }

            // Get updated payment
            const updatedPayment = await spmbDb.query(`
                SELECT * FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [id],
                type: QueryTypes.SELECT
            });

            return res.json({
                message: 'Payment verification updated successfully',
                data: updatedPayment[0]
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error verifying payment',
                error: error.message
            });
        }
    },

    /**
     * Delete payment
     * DELETE /student/re-registration-payment/:id
     */
    async deletePayment(req, res) {
        try {
            const { id } = req.params;

            // Check if payment exists
            const existingPayment = await spmbDb.query(`
                SELECT * FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [id],
                type: QueryTypes.SELECT
            });

            if (!existingPayment || existingPayment.length === 0) {
                return res.status(404).json({
                    message: 'Payment not found'
                });
            }

            // Don't allow deleting verified payments
            if (existingPayment[0].payment_status === 1) {
                return res.status(400).json({
                    message: 'Cannot delete verified payment'
                });
            }

            // Delete payment
            await spmbDb.query(`
                DELETE FROM re_registration_payment WHERE id = ?
            `, {
                replacements: [id],
                type: QueryTypes.DELETE
            });

            return res.json({
                message: 'Payment deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error deleting payment',
                error: error.message
            });
        }
    },

    /**
     * Get payment statistics for a student
     * GET /student/re-registration-payment/stats/:student_id
     */
    async getPaymentStats(req, res) {
        try {
            const { student_id } = req.params;

            const stats = await spmbDb.query(`
                SELECT 
                    COUNT(*) as total_payments,
                    SUM(CASE WHEN payment_status = 1 THEN amount ELSE 0 END) as total_verified,
                    SUM(CASE WHEN payment_status = 0 THEN amount ELSE 0 END) as total_pending,
                    SUM(CASE WHEN payment_status = 2 THEN amount ELSE 0 END) as total_rejected,
                    MIN(payment_date) as first_payment_date,
                    MAX(payment_date) as last_payment_date
                FROM re_registration_payment
                WHERE student_id = ?
            `, {
                replacements: [student_id],
                type: QueryTypes.SELECT
            });

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching payment stats',
                error: error.message
            });
        }
    }
};

module.exports = StudentPaymentController;
