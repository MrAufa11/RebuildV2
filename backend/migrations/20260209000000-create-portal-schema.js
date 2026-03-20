'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dbName = 'portal';

    // 1. Create Users
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.Users (
        id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(255),
        avatar_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Create Apps
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.Apps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        base_url VARCHAR(255),
        icon_class VARCHAR(50),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Create Roles
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.Roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        app_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (app_id) REFERENCES ${dbName}.Apps(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 4. Create UserAppAccess
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.UserAppAccess (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        app_id INT NOT NULL,
        role_id INT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES ${dbName}.Users(id) ON DELETE CASCADE,
        FOREIGN KEY (app_id) REFERENCES ${dbName}.Apps(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES ${dbName}.Roles(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_app (user_id, app_id)
      ) ENGINE=InnoDB;
    `);

    // 5. Create AppMenus
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.AppMenus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        app_id INT NOT NULL,
        parent_id INT,
        label VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        \`order\` INT DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (app_id) REFERENCES ${dbName}.Apps(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 6. Create RolePermissions
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.RolePermissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        menu_id INT NOT NULL,
        can_view BOOLEAN DEFAULT TRUE,
        can_create BOOLEAN DEFAULT FALSE,
        can_update BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES ${dbName}.Roles(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_id) REFERENCES ${dbName}.AppMenus(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 7. Create Tokens
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.Tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        user_id CHAR(36) NOT NULL,
        expires_at DATETIME NOT NULL,
        is_revoked BOOLEAN DEFAULT FALSE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES ${dbName}.Users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
  },

  async down(queryInterface, Sequelize) {
    const dbName = 'portal';
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.Tokens`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.RolePermissions`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.AppMenus`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.UserAppAccess`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.Roles`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.Apps`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${dbName}.Users`);
  }
};
