const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const SelectionTypeController = {
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
                whereClause = 'WHERE s.selection_code LIKE :search OR s.selection_name LIKE :search OR e.level_name LIKE :search';
                params.search = `%${search}%`;
            }
            
            // Get total count
            const [countResult] = await spmbDb.query(`
                SELECT COUNT(DISTINCT s.id) as count
                FROM selection_type s
                LEFT JOIN education_level e ON s.education_level_id = e.id
                ${whereClause}
            `, { 
                replacements: params,
                type: QueryTypes.SELECT 
            });
            const total = parseInt(countResult.count) || 0;
            
            // Get paginated data with JOIN to education_level
            const records = await spmbDb.query(`
                SELECT s.*, e.level_name, e.abbreviation 
                FROM selection_type s
                LEFT JOIN education_level e ON s.education_level_id = e.id
                ${whereClause}
                ORDER BY s.id DESC
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
                data: records
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    async getById(req, res) {
        try {
            // JOIN with education_level to get level name
            const [record] = await spmbDb.query(`
                SELECT s.*, e.level_name, e.abbreviation 
                FROM selection_type s
                LEFT JOIN education_level e ON s.education_level_id = e.id
                WHERE s.id = ?
            `, {
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

            await spmbDb.query(`INSERT INTO selection_type (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE selection_type SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM selection_type WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = SelectionTypeController;
