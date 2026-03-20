const { SchoolData } = require('../models');
const { Op } = require('sequelize');

const SchoolDataController = {
    async getAll(req, res) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const where = {};

            if (search) {
                where.school_name = { [Op.like]: `%${search}%` };
            }

            const { count, rows } = await SchoolData.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['school_name', 'ASC']]
            });

            return res.status(200).json({
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                data: rows
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching schools', error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const school = await SchoolData.findByPk(req.params.id);
            if (!school) return res.status(404).json({ message: 'School not found' });
            return res.status(200).json(school);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching school', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const newSchool = await SchoolData.create(req.body);
            return res.status(201).json(newSchool);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating school', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const school = await SchoolData.findByPk(req.params.id);
            if (!school) return res.status(404).json({ message: 'School not found' });
            await school.update(req.body);
            return res.status(200).json(school);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating school', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const school = await SchoolData.findByPk(req.params.id);
            if (!school) return res.status(404).json({ message: 'School not found' });
            await school.destroy();
            return res.status(200).json({ message: 'School deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting school', error: error.message });
        }
    }
};

module.exports = SchoolDataController;
