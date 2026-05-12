const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const EducationLevelController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // Get total count
            const [countResult] = await spmbDb.query('SELECT COUNT(*) as count FROM education_level', { 
                type: QueryTypes.SELECT 
            });
            const total = parseInt(countResult.count) || 0;

            // Get paginated data
            const records = await spmbDb.query(
                'SELECT * FROM education_level ORDER BY id DESC LIMIT :limit OFFSET :offset', 
                { 
                    replacements: { limit, offset },
                    type: QueryTypes.SELECT 
                }
            );

            return res.json({
                total: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit,
                data: records
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const [record] = await spmbDb.query('SELECT * FROM education_level WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.SELECT
            });
            if (!record) return res.status(404).json({ message: 'Not found' });
            return res.json(record);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async create(req, res) {
        try {
            const data = req.body;
            delete data.id;
            const keys = Object.keys(data).filter(k => k !== 'created_at' && k !== 'updated_at');
            if (keys.length === 0) return res.status(400).json({ message: 'Empty payload' });

            const values = keys.map(k => data[k]);
            const placeholders = keys.map(() => '?').join(', ');

            await spmbDb.query(`INSERT INTO education_level (${keys.join(', ')}) VALUES (${placeholders})`, {
                replacements: values, type: QueryTypes.INSERT
            });
            return res.status(201).json({ message: 'Created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create' });
        }
    },
    async update(req, res) {
        try {
            const data = req.body;
            delete data.id;
            const keys = Object.keys(data).filter(k => k !== 'created_at' && k !== 'updated_at');
            if (keys.length === 0) return res.status(400).json({ message: 'Empty payload' });

            const setString = keys.map(k => `${k} = ?`).join(', ');
            const values = keys.map(k => data[k]);
            values.push(req.params.id);

            await spmbDb.query(`UPDATE education_level SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM education_level WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = EducationLevelController;
