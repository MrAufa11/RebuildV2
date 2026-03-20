'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StudentUser extends Model {
        static associate(models) {
            StudentUser.hasMany(models.SpmbToken, { foreignKey: 'student_id', as: 'tokens' });
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
    });
    return StudentUser;
};
