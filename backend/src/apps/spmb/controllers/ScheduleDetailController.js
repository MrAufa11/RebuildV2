const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const ScheduleDetailController = {
    async getAll(req, res) {
        try {
            const records = await spmbDb.query('SELECT * FROM schedule_detail ORDER BY id DESC', { type: QueryTypes.SELECT });
            return res.json(records);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async getById(req, res) {
        try {
            const [record] = await spmbDb.query('SELECT * FROM schedule_detail WHERE id = ?', {
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

            await spmbDb.query(`INSERT INTO schedule_detail (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE schedule_detail SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM schedule_detail WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = ScheduleDetailController;
