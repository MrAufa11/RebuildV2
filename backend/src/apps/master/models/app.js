'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class App extends Model {
        static associate(models) {
            App.hasMany(models.Role, { foreignKey: 'app_id', as: 'roles' });
            App.hasMany(models.Menu, { foreignKey: 'app_id', as: 'menus' });
        }
    }
    App.init({
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'App',
    });
    return App;
};
