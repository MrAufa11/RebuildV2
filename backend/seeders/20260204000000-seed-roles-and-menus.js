'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Seed Roles
        const rolesToSeed = ['admin', 'user'];
        const existingRoles = await queryInterface.sequelize.query(
            `SELECT name FROM Roles WHERE name IN (:roles)`,
            {
                replacements: { roles: rolesToSeed },
                type: queryInterface.sequelize.QueryTypes.SELECT
            }
        );
        const existingRoleNames = existingRoles.map(r => r.name);
        const newRoles = rolesToSeed.filter(r => !existingRoleNames.includes(r))
            .map(name => ({ name, createdAt: new Date(), updatedAt: new Date() }));

        if (newRoles.length > 0) {
            await queryInterface.bulkInsert('Roles', newRoles);
        }

        // Get Admin Role ID (fetch again to be sure)
        const [adminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'admin';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const adminRoleId = adminRole ? adminRole.id : null;

        if (!adminRoleId) {
            console.error('Admin role not found or created.');
            return;
        }

        // 2. Seed Menus
        // Check if Settings menu exists
        const [existingSettings] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE label = 'Settings' AND parent_id IS NULL;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        let settingsMenuId = existingSettings ? existingSettings.id : null;

        if (!settingsMenuId) {
            await queryInterface.bulkInsert('Menus', [
                {
                    label: 'Settings',
                    url: null,
                    icon: 'settings',
                    parent_id: null,
                    order: 99,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);

            // Get ID after insert
            const [newSettings] = await queryInterface.sequelize.query(
                `SELECT id FROM Menus WHERE label = 'Settings' AND parent_id IS NULL;`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );
            settingsMenuId = newSettings ? newSettings.id : null;
        }

        if (settingsMenuId) {
            // Submenus
            const submenusDef = [
                { label: 'Users', url: '/settings/users', icon: 'people', parent_id: settingsMenuId, order: 1 },
                { label: 'Roles', url: '/settings/roles', icon: 'verified_user', parent_id: settingsMenuId, order: 2 },
                { label: 'Menu', url: '/settings/menus', icon: 'menu', parent_id: settingsMenuId, order: 3 }
            ];

            // Check existing submenus
            const existingSubmenus = await queryInterface.sequelize.query(
                `SELECT label FROM Menus WHERE parent_id = :parentId`,
                {
                    replacements: { parentId: settingsMenuId },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );
            const existingSubmenuLabels = existingSubmenus.map(m => m.label);

            const newSubmenus = submenusDef.filter(m => !existingSubmenuLabels.includes(m.label))
                .map(m => ({
                    ...m,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));

            if (newSubmenus.length > 0) {
                await queryInterface.bulkInsert('Menus', newSubmenus);
            }
        }

        // 3. Seed RoleMenuPermissions
        // Grants for Admin on all these menus.

        // Fetch all relevant menus
        const menus = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE label IN ('Settings', 'Users', 'Roles', 'Menu');`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const existingPermissions = await queryInterface.sequelize.query(
            `SELECT menu_id FROM RoleMenuPermissions WHERE role_id = :roleId`,
            {
                replacements: { roleId: adminRoleId },
                type: queryInterface.sequelize.QueryTypes.SELECT
            }
        );
        const existingPermissionMenuIds = existingPermissions.map(p => p.menu_id);

        const permissionsData = menus
            .filter(menu => !existingPermissionMenuIds.includes(menu.id))
            .map(menu => ({
                role_id: adminRoleId,
                menu_id: menu.id,
                can_view: true,
                can_create: true,
                can_update: true,
                can_delete: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

        if (permissionsData.length > 0) {
            await queryInterface.bulkInsert('RoleMenuPermissions', permissionsData);
        }
    },

    async down(queryInterface, Sequelize) {
        // Delete in reverse order
        await queryInterface.bulkDelete('RoleMenuPermissions', null, {});
        await queryInterface.bulkDelete('Menus', null, {}); // Cascades might handle children, but explicitly safe
        await queryInterface.bulkDelete('Roles', null, {}); // Cascades to users' role_id set null
    }
};
