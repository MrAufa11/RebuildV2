'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Format extends Model {
        static associate(models) {
            // Define associations here if needed
        }
    }
    Format.init({
        code: {
            type: DataTypes.STRING(125),
            allowNull: false,
            unique: true
        },
        table_name: {
            type: DataTypes.STRING(125),
            allowNull: false
        },
        field: {
            type: DataTypes.STRING(125),
            allowNull: false
        },
        relation: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        code_digit: {
            type: DataTypes.STRING(125),
            allowNull: false
        },
        source: {
            type: DataTypes.STRING(225),
            allowNull: false
        },
        hardcode_content: {
            type: DataTypes.STRING(225),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Format',
        tableName: 'format',
        timestamps: false
    });
    return Format;
};
