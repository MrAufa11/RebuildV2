const { Teacher } = require('../models');

const TeacherController = {
    async getAllPublic(req, res) {
        try {
            const teachers = await Teacher.findAll({
                where: { is_active: true },
                order: [['order', 'ASC']]
            });
            return res.status(200).json(teachers);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching teachers', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const teachers = await Teacher.findAll({ order: [['order', 'ASC']] });
            return res.status(200).json(teachers);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching teachers', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.findByPk(id);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            return res.status(200).json(teacher);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching teacher', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const teacher = await Teacher.create(req.body);
            return res.status(201).json({ message: 'Teacher created', data: teacher });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating teacher', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.findByPk(id);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            await teacher.update(req.body);
            return res.status(200).json({ message: 'Teacher updated', data: teacher });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating teacher', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.findByPk(id);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            await teacher.destroy();
            return res.status(200).json({ message: 'Teacher deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting teacher', error: error.message });
        }
    }
};

module.exports = TeacherController;
