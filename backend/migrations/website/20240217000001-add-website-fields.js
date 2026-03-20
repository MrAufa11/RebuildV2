'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add 'excerpt' to Articles if mostly missing
        try {
            await queryInterface.addColumn('Articles', 'excerpt', {
                type: Sequelize.TEXT,
                after: 'slug' // Optional placement
            });
        } catch (e) {
            console.log('excerpt column might already exist');
        }

        // Add 'is_active' to Pages
        try {
            await queryInterface.addColumn('Pages', 'is_active', {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                after: 'content'
            });
        } catch (e) {
            console.log('is_active column might already exist');
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeColumn('Pages', 'is_active');
        } catch (e) { }
        try {
            await queryInterface.removeColumn('Articles', 'excerpt');
        } catch (e) { }
    }
};
