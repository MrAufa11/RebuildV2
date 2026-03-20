'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RegistrantDocument extends Model {
        static associate(models) {
            // Associations can be defined here if needed
        }
    }
    RegistrantDocument.init({
        registrant_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        requirement_master_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        document_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending' // Pending, Verified, Rejected
        },
        notes: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'RegistrantDocument',
        tableName: 'registrant_documents'
    });
    return RegistrantDocument;
};
