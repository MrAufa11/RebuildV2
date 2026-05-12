'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        static associate(models) {
            // Associations can be defined here
        }
    }
    Transaction.init({
        description: DataTypes.STRING,
        amount: DataTypes.DECIMAL(10, 2),
        date: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Transaction',
        tableName: 'Transactions'
    });
    return Transaction;
};
