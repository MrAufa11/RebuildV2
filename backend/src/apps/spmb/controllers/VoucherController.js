const { Voucher, databases } = require('../models');
const { QueryTypes } = require('sequelize');

const VoucherController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';

            // Build WHERE clause for search
            let whereClause = '';
            let params = {};

            if (search) {
                whereClause = 'WHERE v.code LIKE :search OR v.discount_amount LIKE :search';
                params.search = `%${search}%`;
            }

            // Get total count
            const [countResult] = await databases.spmb.query(`
                SELECT COUNT(DISTINCT v.id) as count
                FROM vouchers v
                ${whereClause}
            `, {
                replacements: params,
                type: QueryTypes.SELECT
            });
            const total = parseInt(countResult.count) || 0;

            // Get paginated data with used_count from Registrants table
            const vouchers = await databases.spmb.query(`
                SELECT v.*, COUNT(r.id) as used_count,
                       CASE WHEN COUNT(r.id) > 0 THEN 1 ELSE 0 END as is_used
                FROM vouchers v
                LEFT JOIN Registrants r ON r.voucher_code = v.code
                ${whereClause}
                GROUP BY v.id, v.code, v.discount_amount, v.max_usage, v.current_usage, v.is_active, v.valid_until, v.createdAt, v.updatedAt
                ORDER BY v.id DESC
                LIMIT :limit OFFSET :offset
            `, {
                replacements: {
                    ...params,
                    limit: limit,
                    offset: offset
                },
                type: QueryTypes.SELECT
            });

            return res.json({
                total: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit,
                data: Array.isArray(vouchers) ? vouchers : (vouchers || [])
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });

            // Get used count from Registrants table
            const [usedCount] = await databases.spmb.query(`
                SELECT COUNT(*) as count FROM Registrants WHERE voucher_code = :code
            `, {
                replacements: { code: record.code },
                type: QueryTypes.SELECT
            });

            const data = record.toJSON();
            data.used_count = usedCount.count;
            data.is_used = usedCount.count > 0;

            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async create(req, res) {
        try {
            await Voucher.create(req.body);
            return res.status(201).json({ message: 'Created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create', error: error.message });
        }
    },
    async update(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });

            // Check if voucher is already used (from Registrants table)
            const [usedCount] = await databases.spmb.query(`
                SELECT COUNT(*) as count FROM Registrants WHERE voucher_code = :code
            `, {
                replacements: { code: record.code },
                type: QueryTypes.SELECT
            });

            if (usedCount.count > 0) {
                return res.status(400).json({
                    message: 'Voucher sudah dipakai dan tidak bisa diedit',
                    is_used: true,
                    used_count: usedCount.count
                });
            }

            await record.update(req.body);
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update', error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });

            // Check if voucher is already used (from Registrants table)
            const [usedCount] = await databases.spmb.query(`
                SELECT COUNT(*) as count FROM Registrants WHERE voucher_code = :code
            `, {
                replacements: { code: record.code },
                type: QueryTypes.SELECT
            });

            if (usedCount.count > 0) {
                return res.status(400).json({
                    message: 'Voucher sudah dipakai dan tidak bisa dihapus',
                    is_used: true,
                    used_count: usedCount.count
                });
            }

            await record.destroy();
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    },
    async verifyVoucher(req, res) {
        try {
            const { code } = req.body;
            if (!code) return res.status(400).json({ message: 'Voucher code is required' });

            const voucher = await Voucher.findOne({ where: { code } });
            if (!voucher) {
                return res.status(404).json({ message: 'Voucher tidak ditemukan' });
            }

            // Check if voucher is already used (from Registrants table)
            const [usedCount] = await databases.spmb.query(`
                SELECT COUNT(*) as count FROM Registrants WHERE voucher_code = :code
            `, {
                replacements: { code: voucher.code },
                type: QueryTypes.SELECT
            });

            // Auto-deactivate if used
            if (usedCount.count > 0 && voucher.status === 1) {
                await voucher.update({ status: 0 });
                return res.status(400).json({
                    message: 'Voucher sudah dipakai dan otomatis dinonaktifkan'
                });
            }

            if (!voucher.isValid) {
                return res.status(400).json({ message: 'Voucher sudah tidak aktif, kedaluwarsa, atau telah mencapai batas penggunaan' });
            }

            return res.json({
                message: 'Voucher valid',
                data: {
                    id: voucher.id,
                    code: voucher.code,
                    discount_amount: voucher.discount_amount
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = VoucherController;
