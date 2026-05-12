const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const SelectionScheduleController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            
            // Get total count
            const [countResult] = await spmbDb.query('SELECT COUNT(*) as count FROM selection_schedule', {
                type: QueryTypes.SELECT
            });
            const total = parseInt(countResult.count) || 0;
            
            // Get paginated data with JOINs to get master data names
            const records = await spmbDb.query(`
                SELECT 
                    ss.*,
                    el.level_name as education_level_name,
                    rb.batch_name as batch_name,
                    rp.path_name as path_name,
                    st.selection_name as selection_type_name,
                    c.room_name as room_name
                FROM selection_schedule ss
                LEFT JOIN education_level el ON ss.education_level_id = el.id
                LEFT JOIN registration_batch rb ON ss.registration_batch_id = rb.id
                LEFT JOIN registration_path rp ON ss.registration_path_id = rp.id
                LEFT JOIN selection_type st ON ss.selection_type_id = st.id
                LEFT JOIN room_setup c ON ss.classroom_id = c.id
                ORDER BY ss.id DESC
                LIMIT :limit OFFSET :offset
            `, {
                replacements: { limit, offset },
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
            const [record] = await spmbDb.query('SELECT * FROM selection_schedule WHERE id = ?', {
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

            await spmbDb.query(`INSERT INTO selection_schedule (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE selection_schedule SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM selection_schedule WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = SelectionScheduleController;
