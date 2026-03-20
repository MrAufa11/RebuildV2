'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        static associate(models) {
            Menu.belongsToMany(models.Role, {
                through: 'RoleMenuPermissions',
                foreignKey: 'menu_id',
                as: 'roles'
            });
            Menu.hasMany(Menu, { as: 'children', foreignKey: 'parent_id' });
            Menu.belongsTo(models.App, { as: 'app', foreignKey: 'app_id' });
            Menu.belongsTo(Menu, { as: 'parent', foreignKey: 'parent_id' });
        }
    }
    Menu.init({
        label: DataTypes.STRING,
        url: DataTypes.STRING,
        icon: DataTypes.STRING,
        order: DataTypes.INTEGER,
        app_id: DataTypes.INTEGER,
        parent_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Menu',
    });
    return Menu;
};
