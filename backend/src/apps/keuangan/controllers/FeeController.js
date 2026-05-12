const { databases } = require('../../../../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const FeeController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const educationLevel = req.query.education_level || '';
            const batch = req.query.batch || '';
            const path = req.query.path || '';

            // Build WHERE clause for search and filters
            let whereClause = 'WHERE 1=1';
            let params = {};

            if (search) {
                whereClause += ' AND (fee_name LIKE :search)';
                params.search = `%${search}%`;
            }

            // Add filters
            if (educationLevel) {
                whereClause += ' AND f.education_level = :education_level';
                params.education_level = educationLevel;
            }
            if (batch) {
                whereClause += ' AND f.batch = :batch';
                params.batch = batch;
            }
            if (path) {
                whereClause += ' AND f.path = :path';
                params.path = path;
            }

            // Get total count
            const [countResult] = await spmbDb.query(`
                SELECT COUNT(*) as count FROM fee f
                ${whereClause}
            `, {
                replacements: params,
                type: QueryTypes.SELECT
            });
            const total = parseInt(countResult.count) || 0;

            // Get paginated data with JOINs to get reference names
            const records = await spmbDb.query(`
                SELECT 
                    f.*,
                    el.level_name as education_level_name,
                    rb.batch_name as batch_name,
                    rb.batch_code,
                    rp.path_name as path_name,
                    rsp.sub_path_name
                FROM fee f
                LEFT JOIN education_level el ON f.education_level = el.id
                LEFT JOIN registration_batch rb ON f.batch = rb.id
                LEFT JOIN registration_path rp ON f.path = rp.id
                LEFT JOIN registration_sub_path rsp ON f.sub_path = rsp.id
                ${whereClause}
                ORDER BY f.education_level, f.path, f.sequence ASC
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
            const [record] = await spmbDb.query('SELECT * FROM fee WHERE id = ?', {
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

            await spmbDb.query(`INSERT INTO fee (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE fee SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM fee WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = FeeController;
