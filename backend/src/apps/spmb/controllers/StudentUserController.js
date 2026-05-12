const { StudentUser, Registrant } = require('../models');

const StudentUserController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status, biodata } = req.query;

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

            const registrantWhere = {};
            if (biodata !== undefined && biodata !== '') {
                if (biodata === '1') {
                    // Sudah isi (e.g. gender is not null, or biodataLengkap is not null)
                    registrantWhere.biodataLengkap = { [Op.not]: null };
                } else if (biodata === '0') {
                    // Belum isi
                    registrantWhere.biodataLengkap = null;
                }
            }

            const { count, rows } = await StudentUser.findAndCountAll({
                where,
                include: [{
                    model: Registrant,
                    as: 'registrant',
                    where: Object.keys(registrantWhere).length > 0 ? registrantWhere : undefined,
                    required: Object.keys(registrantWhere).length > 0, // only inner join if filtering by biodata
                    attributes: ['id', 'biodataLengkap']
                }],
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                distinct: true // ensure count is correct with includes
            });

            // Map rows to include biodataFilled status and ensure id is included
            const mappedRows = rows.map(r => {
                const plain = r.get({ plain: true });
                // Ensure student_user_id is explicitly included
                plain.student_user_id = plain.id;
                plain.biodataFilled = plain.registrant && plain.registrant.biodataLengkap ? true : false;
                return plain;
            });

            return res.status(200).json({
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
                data: mappedRows
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching data leads', error: error.message });
        }
    }
};

module.exports = StudentUserController;
