'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Add 'is_revoked' to Tokens
        try {
            await queryInterface.addColumn('Tokens', 'is_revoked', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                after: 'expires_at'
            });
        } catch (e) {
            console.log('is_revoked column might already exist');
        }

        // 2. Add 'app_id' to Menus
        try {
            await queryInterface.addColumn('Menus', 'app_id', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Apps',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                after: 'order'
            });
        } catch (e) {
            console.log('app_id column might already exist in Menus');
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeColumn('Menus', 'app_id');
        } catch (e) { }
        try {
            await queryInterface.removeColumn('Tokens', 'is_revoked');
        } catch (e) { }
    }
};
