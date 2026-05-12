'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Navbar extends Model {
        static associate(models) {
            // Define association here
            Navbar.hasMany(Navbar, { as: 'children', foreignKey: 'parent_id' });
            Navbar.belongsTo(Navbar, { as: 'parent', foreignKey: 'parent_id' });
        }
    }
    Navbar.init({
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Navbar',
    });
    return Navbar;
};
