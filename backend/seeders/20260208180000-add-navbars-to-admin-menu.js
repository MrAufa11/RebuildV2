'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Get Settings Menu ID
        const [settingsMenu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE label = 'Settings' AND parent_id IS NULL LIMIT 1;`
        );

        if (!settingsMenu || settingsMenu.length === 0) {
            console.log('Settings menu not found, skipping...');
            return;
        }
        const settingsMenuId = settingsMenu[0].id;

        // 2. Insert Navbar Menu
        const [existingNavbarMenu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE url = '/navbars' LIMIT 1;`
        );

        let navbarMenuId;
        if (!existingNavbarMenu || existingNavbarMenu.length === 0) {
            await queryInterface.bulkInsert('Menus', [{
                label: 'Public Navbars',
                url: '/navbars',
                icon: 'fas fa-compass',
                parent_id: settingsMenuId,
                order: 4,
                createdAt: now,
                updatedAt: now
            }]);

            const [newMenu] = await queryInterface.sequelize.query(
                `SELECT id FROM Menus WHERE url = '/navbars' LIMIT 1;`
            );
            navbarMenuId = newMenu[0].id;
        } else {
            navbarMenuId = existingNavbarMenu[0].id;
        }

        // 3. Grant Permission to Admin
        const [adminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1;`
        );

        if (adminRole && adminRole.length > 0) {
            const adminRoleId = adminRole[0].id;

            const [existingPerm] = await queryInterface.sequelize.query(
                `SELECT id FROM RoleMenuPermissions WHERE role_id = ${adminRoleId} AND menu_id = ${navbarMenuId} LIMIT 1;`
            );

            if (!existingPerm || existingPerm.length === 0) {
                await queryInterface.bulkInsert('RoleMenuPermissions', [{
                    role_id: adminRoleId,
                    menu_id: navbarMenuId,
                    can_view: true,
                    can_create: true,
                    can_update: true,
                    can_delete: true,
                    createdAt: now,
                    updatedAt: now
                }]);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        const [menu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE url = '/navbars' LIMIT 1;`
        );
        if (menu && menu.length > 0) {
            await queryInterface.bulkDelete('RoleMenuPermissions', { menu_id: menu[0].id });
            await queryInterface.bulkDelete('Menus', { id: menu[0].id });
        }
    }
};
