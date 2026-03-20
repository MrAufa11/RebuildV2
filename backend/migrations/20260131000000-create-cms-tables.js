'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Settings Table (Global Config, Welcome Section, Stats, Footer)
        await queryInterface.createTable('Settings', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            key: { type: Sequelize.STRING, allowNull: false, unique: true }, // e.g., 'school_name', 'hero_title'
            value: { type: Sequelize.TEXT, allowNull: true },
            type: { type: Sequelize.STRING, defaultValue: 'text' }, // text, image, number, json
            group: { type: Sequelize.STRING, defaultValue: 'general' }, // general, home_welcome, home_stats, contact
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // 2. Banners Table (Hero Slider)
        await queryInterface.createTable('Banners', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            title: { type: Sequelize.STRING, allowNull: false },
            subtitle: { type: Sequelize.STRING, allowNull: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            image_url: { type: Sequelize.STRING, allowNull: false },
            button_text: { type: Sequelize.STRING, allowNull: true },
            button_url: { type: Sequelize.STRING, allowNull: true },
            order: { type: Sequelize.INTEGER, defaultValue: 0 },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // 3. Teachers Table (Tenaga Pendidik)
        await queryInterface.createTable('Teachers', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            position: { type: Sequelize.STRING, allowNull: false }, // e.g., Kepala Sekolah
            image_url: { type: Sequelize.STRING, allowNull: true },
            quote: { type: Sequelize.TEXT, allowNull: true }, // For Headmaster specific quote if needed
            order: { type: Sequelize.INTEGER, defaultValue: 0 },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // 4. Categories Table (For Articles/News)
        await queryInterface.createTable('Categories', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // 5. Articles Table (Berita/Kabar)
        await queryInterface.createTable('Articles', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            title: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            excerpt: { type: Sequelize.TEXT, allowNull: true }, // Short description
            content: { type: Sequelize.TEXT, allowNull: false }, // HTML Content
            image_url: { type: Sequelize.STRING, allowNull: true },
            category_id: {
                type: Sequelize.INTEGER,
                references: { model: 'Categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            author_id: {
                type: Sequelize.INTEGER,
                references: { model: 'Users', key: 'id' }, // Assuming Users table exists
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            published_at: { type: Sequelize.DATE, allowNull: true },
            status: { type: Sequelize.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // 6. Galleries Table (Dokumentasi)
        await queryInterface.createTable('Galleries', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            title: { type: Sequelize.STRING, allowNull: true },
            image_url: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.TEXT, allowNull: true },
            category: { type: Sequelize.STRING, defaultValue: 'general' }, // e.g. activities, facilities
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Galleries');
        await queryInterface.dropTable('Articles');
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Teachers');
        await queryInterface.dropTable('Banners');
        await queryInterface.dropTable('Settings');
    }
};
