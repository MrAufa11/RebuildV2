'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Get Admin Role ID
        const [adminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1;`
        );

        if (!adminRole || adminRole.length === 0) {
            console.error('Role admin not found! Please run role seeder first.');
            return;
        }
        const adminRoleId = adminRole[0].id;

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash('password', 10);

        // 3. Check if user admin already exists
        const [existingUser] = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE username = 'admin' OR email = 'admin@almawahib.sch.id' LIMIT 1;`
        );

        if (!existingUser || existingUser.length === 0) {
            // 4. Create Admin User
            await queryInterface.bulkInsert('Users', [{
                username: 'admin',
                email: 'admin@almawahib.sch.id',
                password: hashedPassword,
                role_id: adminRoleId,
                createdAt: now,
                updatedAt: now
            }]);
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
    }
};
