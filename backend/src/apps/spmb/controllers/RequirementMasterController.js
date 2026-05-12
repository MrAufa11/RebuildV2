const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const RequirementMasterController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const educationLevel = req.query.education_level || '';
            const path = req.query.path || '';
            const batch = req.query.batch || '';
            // Build WHERE clause for search and filters
            
            let whereClause = 'WHERE 1=1';
            let params = {};

            if (search) {
                whereClause += ' AND (requirement_name LIKE :search OR code LIKE :search)';
                params.search = `%${search}%`;
            }

            // Add filters for education_level, path, batch
            // Support both ID and name-based filtering
            if (educationLevel) {
                // Check if it's a number (ID) or string (name)
                const isNumeric = !isNaN(educationLevel);
                if (isNumeric) {
                    // Filter by ID
                    whereClause += ' AND JSON_CONTAINS(education_levels, :education_level)';
                    params.education_level = JSON.stringify(parseInt(educationLevel));
                } else {
                    // Filter by name - fetch matching education_level IDs first
                    const eduLevels = await spmbDb.query(`
                        SELECT id FROM education_level 
                        WHERE level_name LIKE :edu_name
                    `, {
                        replacements: { edu_name: `%${educationLevel}%` },
                        type: QueryTypes.SELECT
                    });
                    
                    if (eduLevels.length > 0) {
                        const eduIds = eduLevels.map(e => e.id);
                        // Build OR conditions for each matching ID
                        const eduConditions = eduIds.map((id, idx) => 
                            `JSON_CONTAINS(education_levels, :edu_${idx})`
                        );
                        eduIds.forEach((id, idx) => {
                            params[`edu_${idx}`] = JSON.stringify(id);
                        });
                        whereClause += ` AND (${eduConditions.join(' OR ')})`;
                    } else {
                        // No matching education level, return empty
                        whereClause += ' AND 1=0';
                    }
                }
            }
            
            if (path) {
                // Check if it's a number (ID) or string (name)
                const isNumeric = !isNaN(path);
                if (isNumeric) {
                    // Filter by ID
                    whereClause += ' AND JSON_CONTAINS(paths, :path)';
                    params.path = JSON.stringify(parseInt(path));
                } else {
                    // Filter by name - fetch matching path IDs first
                    const paths = await spmbDb.query(`
                        SELECT id FROM registration_path 
                        WHERE path_name LIKE :path_name
                    `, {
                        replacements: { path_name: `%${path}%` },
                        type: QueryTypes.SELECT
                    });
                    
                    if (paths.length > 0) {
                        const pathIds = paths.map(p => p.id);
                        // Build OR conditions for each matching ID
                        const pathConditions = pathIds.map((id, idx) => 
                            `JSON_CONTAINS(paths, :path_${idx})`
                        );
                        pathIds.forEach((id, idx) => {
                            params[`path_${idx}`] = JSON.stringify(id);
                        });
                        whereClause += ` AND (${pathConditions.join(' OR ')})`;
                    } else {
                        // No matching path, return empty
                        whereClause += ' AND 1=0';
                    }
                }
            }
            
            if (batch) {
                // Check if it's a number (ID) or string (name)
                const isNumeric = !isNaN(batch);
                if (isNumeric) {
                    // Filter by ID
                    whereClause += ' AND JSON_CONTAINS(batches, :batch)';
                    params.batch = JSON.stringify(parseInt(batch));
                } else {
                    // Filter by name - fetch matching batch IDs first
                    const batches = await spmbDb.query(`
                        SELECT id FROM registration_batch 
                        WHERE batch_name LIKE :batch_name
                    `, {
                        replacements: { batch_name: `%${batch}%` },
                        type: QueryTypes.SELECT
                    });
                    
                    if (batches.length > 0) {
                        const batchIds = batches.map(b => b.id);
                        // Build OR conditions for each matching ID
                        const batchConditions = batchIds.map((id, idx) => 
                            `JSON_CONTAINS(batches, :batch_${idx})`
                        );
                        batchIds.forEach((id, idx) => {
                            params[`batch_${idx}`] = JSON.stringify(id);
                        });
                        whereClause += ` AND (${batchConditions.join(' OR ')})`;
                    } else {
                        // No matching batch, return empty
                        whereClause += ' AND 1=0';
                    }
                }
            }
        
            // Get total count
            const [countResult] = await spmbDb.query(`
                SELECT COUNT(*) as count FROM requirement_master
                ${whereClause}
            `, {
                replacements: params,
                type: QueryTypes.SELECT
            });
            const total = parseInt(countResult.count) || 0;
    
            // Get paginated data
            const records = await spmbDb.query(`
                SELECT * FROM requirement_master
                ${whereClause}
                ORDER BY id DESC
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
            const [record] = await spmbDb.query('SELECT * FROM requirement_master WHERE id = ?', {
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

            await spmbDb.query(`INSERT INTO requirement_master (${keys.join(', ')}) VALUES (${placeholders})`, {
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

            await spmbDb.query(`UPDATE requirement_master SET ${setString} WHERE id = ?`, {
                replacements: values, type: QueryTypes.UPDATE
            });
            return res.json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update' });
        }
    },
    async delete(req, res) {
        try {
            await spmbDb.query('DELETE FROM requirement_master WHERE id = ?', {
                replacements: [req.params.id], type: QueryTypes.DELETE
            });
            return res.json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }
};
module.exports = RequirementMasterController;
