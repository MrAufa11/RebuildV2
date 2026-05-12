'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StudentUser extends Model {
        static associate(models) {
            if (models && models.SpmbToken) {
                StudentUser.hasMany(models.SpmbToken, { foreignKey: 'student_id', as: 'tokens' });
            }
            // Registrant model may not be present in every deployment - guard the association
            if (models && models.Registrant) {
                StudentUser.hasOne(models.Registrant, { 
                    foreignKey: 'student_user_id', 
                    sourceKey: 'id', 
                    as: 'registrant',
                    onDelete: 'SET NULL'
                });
            }
        }
    }
    StudentUser.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'StudentUser',
        tableName: 'StudentUsers',
    });
    return StudentUser;
};
