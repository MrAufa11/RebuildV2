'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create StudentUsers Table
        await queryInterface.createTable('StudentUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
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

        // 2. Create SpmbTokens Table
        await queryInterface.createTable('SpmbTokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            token: {
                type: Sequelize.TEXT
            },
            student_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'StudentUsers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            expires_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            is_revoked: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('SpmbTokens');
        await queryInterface.dropTable('StudentUsers');
    }
};
