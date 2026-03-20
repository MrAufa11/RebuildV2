'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RegistrationSubPath extends Model {
        static associate(models) {
            // Associations can be defined here if needed
        }
    }
    RegistrationSubPath.init({
        registration_path_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sub_path_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'RegistrationSubPath',
        tableName: 'registration_sub_path',
        timestamps: false
    });
    return RegistrationSubPath;
};
