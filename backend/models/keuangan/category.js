'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // Associations can be defined here
        }
    }
    Category.init({
        name: DataTypes.STRING,
        type: DataTypes.ENUM('Income', 'Expense')
    }, {
        sequelize,
        modelName: 'FinanceCategory', // Renamed to avoid conflict with website category
        tableName: 'Categories'
    });
    return Category;
};
