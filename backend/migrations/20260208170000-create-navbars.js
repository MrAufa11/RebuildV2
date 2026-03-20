'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Navbars', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            label: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            icon: {
                type: Sequelize.STRING,
                allowNull: true
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            parent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Navbars',
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
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

        // Add indexes for performance
        await queryInterface.addIndex('Navbars', ['parent_id']);
        await queryInterface.addIndex('Navbars', ['order']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Navbars');
    }
};
