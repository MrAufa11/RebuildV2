const { StudentUser } = require('../models');

const StudentUserController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status } = req.query;

            const { Op } = require('sequelize');
            const where = {};

            if (search) {
                where[Op.or] = [
                    { username: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            if (status !== undefined && status !== '') {
                where.isActive = status === '1' || status === 'true';
            }

            const { count, rows } = await StudentUser.findAndCountAll({
                where,
                order: [['createdAt', 'ASC']],
                limit,
                offset
            });

            return res.status(200).json({
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
                data: rows
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching data leads', error: error.message });
        }
    }
};

module.exports = StudentUserController;
