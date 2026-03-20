'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Registrants
        await queryInterface.createTable('Registrants', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            entryPath: {
                type: Sequelize.ENUM('Reguler', 'Prestasi', 'Indent'),
                defaultValue: 'Reguler'
            },
            schoolOrigin: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
                defaultValue: 'Pending'
            },
            notes: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('Registrants');
    }
};
