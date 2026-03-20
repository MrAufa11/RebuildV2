'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // 1. Remove string category
            await queryInterface.removeColumn('Galleries', 'category');
        } catch (e) {
            console.log('Column category might not exist');
        }

        try {
            // 2. Add category_id
            await queryInterface.addColumn('Galleries', 'category_id', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        } catch (e) {
            console.log('Column category_id might already exist');
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeColumn('Galleries', 'category_id');
            await queryInterface.addColumn('Galleries', 'category', {
                type: Sequelize.STRING
            });
        } catch (e) { }
    }
};
