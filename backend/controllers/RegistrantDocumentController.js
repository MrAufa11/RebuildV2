const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

const RegistrantDocumentController = {
    async getByRegistrant(req, res) {
        try {
            const { registrantId } = req.params;
            const records = await spmbDb.query('SELECT * FROM registrant_documents WHERE registrant_id = ?', {
                replacements: [registrantId],
                type: QueryTypes.SELECT
            });
            return res.json(records);
        } catch (error) {
            console.error('Error in getByRegistrant:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async create(req, res) {
        try {
            const { registrant_id, requirement_master_id, document_url, status, notes } = req.body;

            // Check if already exists for this requirement, if so update it instead? 
            // Usually students re-upload to replace.
            const [existing] = await spmbDb.query(
                'SELECT id FROM registrant_documents WHERE registrant_id = ? AND requirement_master_id = ?',
                { replacements: [registrant_id, requirement_master_id], type: QueryTypes.SELECT }
            );

            if (existing) {
                await spmbDb.query(
                    'UPDATE registrant_documents SET document_url = ?, status = ?, updatedAt = NOW() WHERE id = ?',
                    { replacements: [document_url, status || 'Pending', existing.id], type: QueryTypes.UPDATE }
                );
                return res.json({ message: 'Document updated successfully' });
            }

            await spmbDb.query(
                'INSERT INTO registrant_documents (registrant_id, requirement_master_id, document_url, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
                {
                    replacements: [registrant_id, requirement_master_id, document_url, status || 'Pending', notes || ''],
                    type: QueryTypes.INSERT
                }
            );
            return res.status(201).json({ message: 'Document created successfully' });
        } catch (error) {
            console.error('Error in create registrant document:', error);
            return res.status(500).json({ message: 'Failed to create document' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            await spmbDb.query('DELETE FROM registrant_documents WHERE id = ?', {
                replacements: [id],
                type: QueryTypes.DELETE
            });
            return res.json({ message: 'Document deleted successfully' });
        } catch (error) {
            console.error('Error in delete registrant document:', error);
            return res.status(500).json({ message: 'Failed to delete document' });
        }
    }
};

module.exports = RegistrantDocumentController;
