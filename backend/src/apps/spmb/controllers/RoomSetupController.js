const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const RoomSetupController = {
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
                whereClause = 'WHERE r.room_code LIKE :search OR r.room_name LIKE :search OR b.building_name LIKE :search';
                params.search = `%${search}%`;
            }
            
            // Get total count
            const [countResult] = await spmbDb.query(`
                SELECT COUNT(DISTINCT r.id) as count
                FROM room_setup r
                LEFT JOIN building_setup b ON r.building_setup_id = b.id
                ${whereClause}
            `, { 
                replacements: params,
                type: QueryTypes.SELECT 
            });
            const total = parseInt(countResult.count) || 0;
            
            // Get paginated data with JOIN to building_setup
            const records = await spmbDb.query(`
                SELECT r.*, b.building_name 
                FROM room_setup r
                LEFT JOIN building_setup b ON r.building_setup_id = b.id
                ${whereClause}
                ORDER BY r.id DESC
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
            // JOIN with building_setup to get building name
            const [record] = await spmbDb.query(`
                SELECT r.*, b.building_name 
                FROM room_setup r
                LEFT JOIN building_setup b ON r.building_setup_id = b.id
                WHERE r.id = ?
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

            await spmbDb.query(`INSERT INTO room_setup (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE room_setup SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM room_setup WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = RoomSetupController;
