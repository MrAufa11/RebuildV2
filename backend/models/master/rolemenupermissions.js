'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RoleMenuPermissions extends Model {
        static associate(models) {
            // define association here
        }
    }
    RoleMenuPermissions.init({
        role_id: DataTypes.INTEGER,
        menu_id: DataTypes.INTEGER,
        can_view: DataTypes.BOOLEAN,
        can_create: DataTypes.BOOLEAN,
        can_update: DataTypes.BOOLEAN,
        can_delete: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'RoleMenuPermissions',
    });
    return RoleMenuPermissions;
};
