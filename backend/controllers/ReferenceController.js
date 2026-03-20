const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

// List of allowed tables so users can't query private/auth tables
const ALLOWED_TABLES = [
    'religion', 'bank', 'schedule_detail', 'discount', 'format',
    'registration_batch', 'fee', 'position', 'selection_schedule',
    'registration_path', 'selection_type', 'classroom', 'exam_number',
    'occupation', 'income', 'school_data', 'building_setup', 'room_setup',
    'discount_setup', 'academic_year_setup', 'life_status',
    'registration_sub_path', 'requirement_master', 'education_level',
    'voucher'
];

const ReferenceController = {
    async getTables(req, res) {
        try {
            // Can be mapped to friendly names if needed
            const tables = ALLOWED_TABLES.map(table => ({
                code: table,
                name: table.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            }));
            return res.json({ tables });
        } catch (error) {
            console.error('Error getting reference tables:', error);
            return res.status(500).json({ message: 'Error retrieving tables' });
        }
    },

    async getTableData(req, res) {
        try {
            const { table } = req.params;
            if (!ALLOWED_TABLES.includes(table)) {
                return res.status(403).json({ message: 'Access denied: Table not allowed' });
            }

            // Get columns descriptor for UI rendering
            const columns = await spmbDb.query(`SHOW COLUMNS FROM ${table}`, { type: QueryTypes.SELECT });

            // Get records
            const records = await spmbDb.query(`SELECT * FROM ${table} ORDER BY id DESC`, { type: QueryTypes.SELECT });

            return res.json({ columns, records });
        } catch (error) {
            console.error(`Error retrieving data for table ${req.params.table}:`, error);
            return res.status(500).json({ message: 'Error retrieving table data', error: error.message });
        }
    },

    async getColumns(req, res) {
        try {
            const { table } = req.params;
            if (!ALLOWED_TABLES.includes(table)) return res.status(403).json({ message: 'Table not allowed' });
            const columns = await spmbDb.query(`SHOW COLUMNS FROM ${table}`, { type: QueryTypes.SELECT });
            return res.json({ columns });
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving columns', error: error.message });
        }
    },

    async getRow(req, res) {
        try {
            const { table, id } = req.params;
            if (!ALLOWED_TABLES.includes(table)) return res.status(403).json({ message: 'Table not allowed' });

            const [record] = await spmbDb.query(`SELECT * FROM ${table} WHERE id = ?`, {
                replacements: [id], type: QueryTypes.SELECT
            });

            if (!record) return res.status(404).json({ message: 'Record not found' });
            return res.json(record);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving record', error: error.message });
        }
    },

    async createRow(req, res) {
        try {
            const { table } = req.params;
            if (!ALLOWED_TABLES.includes(table)) return res.status(403).json({ message: 'Table not allowed' });

            const data = req.body;
            delete data.id; // ensure ID is not passed for auto increment

            const keys = Object.keys(data).filter(key => key !== 'created_at' && key !== 'updated_at');
            const values = keys.map(key => data[key]);
            const placeholders = keys.map(() => '?').join(', ');

            if (keys.length === 0) return res.status(400).json({ message: 'Empty payload' });

            const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

            await spmbDb.query(query, {
                replacements: values,
                type: QueryTypes.INSERT
            });

            return res.status(201).json({ message: 'Record created successfully' });
        } catch (error) {
            console.error(`Error creating row in ${req.params.table}:`, error);
            return res.status(500).json({ message: 'Failed to create record', error: error.message });
        }
    },

    async updateRow(req, res) {
        try {
            const { table, id } = req.params;
            if (!ALLOWED_TABLES.includes(table)) return res.status(403).json({ message: 'Table not allowed' });

            const data = req.body;
            delete data.id;

            const keys = Object.keys(data).filter(key => key !== 'created_at' && key !== 'updated_at');
            if (keys.length === 0) return res.status(400).json({ message: 'Empty payload' });

            const setString = keys.map(key => `${key} = ?`).join(', ');
            const values = keys.map(key => data[key]);
            values.push(id); // For the WHERE clause

            const query = `UPDATE ${table} SET ${setString} WHERE id = ?`;

            await spmbDb.query(query, {
                replacements: values,
                type: QueryTypes.UPDATE
            });

            return res.status(200).json({ message: 'Record updated successfully' });
        } catch (error) {
            console.error(`Error updating row in ${req.params.table}:`, error);
            return res.status(500).json({ message: 'Failed to update record', error: error.message });
        }
    },

    async deleteRow(req, res) {
        try {
            const { table, id } = req.params;
            if (!ALLOWED_TABLES.includes(table)) return res.status(403).json({ message: 'Table not allowed' });

            const query = `DELETE FROM ${table} WHERE id = ?`;
            await spmbDb.query(query, {
                replacements: [id],
                type: QueryTypes.DELETE
            });

            return res.status(200).json({ message: 'Record deleted successfully' });
        } catch (error) {
            console.error(`Error deleting row from ${req.params.table}:`, error);
            return res.status(500).json({ message: 'Failed to delete record', error: error.message });
        }
    }
};

module.exports = ReferenceController;
