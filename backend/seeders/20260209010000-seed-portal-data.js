'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const dbName = 'portal';

        // 1. Seed Apps (SQL Insert with explicit database prefix)
        await queryInterface.sequelize.query(`
        INSERT IGNORE INTO ${dbName}.Apps (id, code, name, base_url, icon_class, createdAt, updatedAt) VALUES
        (1, 'website', 'Website Utama', 'http://localhost:5173', 'fas fa-globe', NOW(), NOW()),
        (2, 'spmb', 'Sistem PMB', 'http://localhost:5174', 'fas fa-user-graduate', NOW(), NOW()),
        (3, 'finance', 'Keuangan', 'http://localhost:5175', 'fas fa-wallet', NOW(), NOW())
    `);

        // 2. Seed Roles
        await queryInterface.sequelize.query(`
        INSERT IGNORE INTO ${dbName}.Roles (id, app_id, name, description, createdAt, updatedAt) VALUES
        (1, 1, 'Super Admin', 'Administrator Website', NOW(), NOW()),
        (2, 2, 'Admin PMB', 'Administrator Penerimaan Siswa Baru', NOW(), NOW()),
        (3, 3, 'Admin Keuangan', 'Administrator Keuangan', NOW(), NOW())
    `);

        // 3. Seed Users (Admin)
        const passwordHash = await bcrypt.hash('password', 10);
        const adminId = '123e4567-e89b-12d3-a456-426614174000';

        // Check if user exists
        const [existing] = await queryInterface.sequelize.query(`SELECT id FROM ${dbName}.Users WHERE id = '${adminId}'`);

        if (existing.length === 0) {
            await queryInterface.sequelize.query(`
        INSERT INTO ${dbName}.Users (id, username, email, password, fullname, is_active, createdAt, updatedAt)
        VALUES ('${adminId}', 'admin', 'admin@almawahib.sch.id', '${passwordHash}', 'Super Administrator', 1, NOW(), NOW())
      `);
        }

        // 4. Seed User Access
        await queryInterface.sequelize.query(`
      INSERT IGNORE INTO ${dbName}.UserAppAccess (user_id, app_id, role_id, createdAt, updatedAt)
      VALUES 
      ('${adminId}', 1, 1, NOW(), NOW()),
      ('${adminId}', 2, 2, NOW(), NOW()),
      ('${adminId}', 3, 3, NOW(), NOW())
    `);

        console.log('Seeded Portal data successfully.');
    },

    async down(queryInterface, Sequelize) {
        // Delete seed data if needed
    }
};
