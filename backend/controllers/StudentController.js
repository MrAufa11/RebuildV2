const { Student } = require('../models');

const StudentController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, year } = req.query;

            const { Op } = require('sequelize');
            const where = {};

            if (search) {
                where[Op.or] = [
                    { full_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { nisn: { [Op.like]: `%${search}%` } }
                ];
            }

            if (year) where.registration_year = year;

            const { count, rows } = await Student.findAndCountAll({
                where,
                include: [{
                    model: require('../models').SchoolData,
                    as: 'school',
                    required: false
                }],
                order: [['created_at', 'ASC']],
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
            return res.status(500).json({ message: 'Error fetching students', error: error.message });
        }
    }
};

module.exports = StudentController;
