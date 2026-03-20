'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Transactions (Placeholder)
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2)
            },
            date: {
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // 2. Categories (Keuangan)
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.ENUM('Income', 'Expense')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Transactions');
    }
};
