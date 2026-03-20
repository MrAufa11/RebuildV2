'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create Apps Table
        await queryInterface.createTable('Apps', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true // e.g., 'website', 'spmb', 'keuangan'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
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

        // 2. Create Roles Table (with app_id)
        await queryInterface.createTable('Roles', {
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
            app_id: {
                type: Sequelize.INTEGER,
                allowNull: true, // Nullable for Super Admin / Global roles
                references: {
                    model: 'Apps',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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

        // 3. Create Users Table
        await queryInterface.createTable('Users', {
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
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Roles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            refresh_token: {
                type: Sequelize.TEXT,
                allowNull: true
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

        // 4. Create Menus Table
        await queryInterface.createTable('Menus', {
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
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Menus',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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

        // 5. Create RoleMenuPermissions Table
        await queryInterface.createTable('RoleMenuPermissions', {
            role_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Roles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            menu_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Menus',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            can_view: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            can_create: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            can_update: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            can_delete: {
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

        // 6. Create Tokens Table (if used separately, though usually user has refresh_token column)
        // Assuming User model has refresh_token column, but if there was a separate Tokens table:
        await queryInterface.createTable('Tokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            token: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false
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
        await queryInterface.dropTable('RoleMenuPermissions');
        await queryInterface.dropTable('Tokens');
        await queryInterface.dropTable('Menus');
        await queryInterface.dropTable('Users');
        await queryInterface.dropTable('Roles');
        await queryInterface.dropTable('Apps');
    }
};
