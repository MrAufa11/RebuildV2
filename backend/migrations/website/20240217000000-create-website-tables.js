'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Articles
        await queryInterface.createTable('Articles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT
            },
            image_url: {
                type: Sequelize.STRING
            },
            category_id: {
                type: Sequelize.INTEGER // Assuming foreign key to Categories
            },
            author_id: {
                type: Sequelize.INTEGER // Assuming foreign key to Users
            },
            published_at: {
                type: Sequelize.DATE
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'draft'
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

        // 2. Categories
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: 'news'
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

        // 3. Teachers
        await queryInterface.createTable('Teachers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            position: {
                type: Sequelize.STRING
            },
            image_url: {
                type: Sequelize.STRING
            },
            quote: {
                type: Sequelize.TEXT
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            is_active: {
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

        // 4. Galleries
        await queryInterface.createTable('Galleries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image_url: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            category: {
                type: Sequelize.STRING
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

        // 5. Banners
        await queryInterface.createTable('Banners', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            subtitle: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            image_url: {
                type: Sequelize.STRING
            },
            button_text: {
                type: Sequelize.STRING
            },
            button_url: {
                type: Sequelize.STRING
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            is_active: {
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

        // 6. Navbars
        await queryInterface.createTable('Navbars', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            label: {
                type: Sequelize.STRING
            },
            url: {
                type: Sequelize.STRING
            },
            icon: {
                type: Sequelize.STRING
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            parent_id: {
                type: Sequelize.INTEGER // Self reference
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

        // 7. Settings
        await queryInterface.createTable('Settings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            key: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            value: {
                type: Sequelize.TEXT
            },
            type: {
                type: Sequelize.STRING
            },
            group: {
                type: Sequelize.STRING
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

        // 8. Pages
        await queryInterface.createTable('Pages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.TEXT
            },
            slug: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Pages');
        await queryInterface.dropTable('Settings');
        await queryInterface.dropTable('Navbars');
        await queryInterface.dropTable('Banners');
        await queryInterface.dropTable('Galleries');
        await queryInterface.dropTable('Teachers');
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Articles');
    }
};
