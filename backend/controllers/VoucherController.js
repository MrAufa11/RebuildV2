const { databases } = require('../models');
const Voucher = require('../models/spmb/voucher')(databases.spmb, require('sequelize').DataTypes);

const VoucherController = {
    async getAll(req, res) {
        try {
            const records = await Voucher.findAll({ order: [['id', 'DESC']] });
            return res.json(records);
        } catch (error) {
            console.error('Error in getAll:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async getById(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });
            return res.json(record);
        } catch (error) {
            console.error('Error in getById:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async create(req, res) {
        try {
            await Voucher.create(req.body);
            return res.status(201).json({ message: 'Created successfully' });
        } catch (error) {
            console.error('Error in create for voucher:', error);
            return res.status(500).json({ message: 'Failed to create', error: error.message });
        }
    },
    async update(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });

            await record.update(req.body);
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            console.error('Error in update:', error);
            return res.status(500).json({ message: 'Failed to update', error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const record = await Voucher.findByPk(req.params.id);
            if (!record) return res.status(404).json({ message: 'Not found' });

            await record.destroy();
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error in delete:', error);
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
            console.error('Error in verifyVoucher:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = VoucherController;
