'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Get Admin Role ID
        const [adminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1;`
        );
        if (!adminRole || adminRole.length === 0) return;
        const adminRoleId = adminRole[0].id;

        // 2. Define Menu Structure based on Router
        // We will organize them into Groups for better UX
        const menus = [
            // Dashboard
            { label: 'Dashboard', url: '/admin', icon: 'fas fa-home', parent_id: null, order: 1 },

            // Master Data Group
            {
                label: 'Master Data', url: '#', icon: 'fas fa-database', parent_id: null, order: 2, children: [
                    { label: 'Users', url: '/users', icon: 'fas fa-users', order: 1 },
                    { label: 'Roles', url: '/roles', icon: 'fas fa-user-tag', order: 2 },
                    { label: 'Teachers', url: '/teachers', icon: 'fas fa-chalkboard-teacher', order: 3 },
                    { label: 'Data Menu', url: '/menus', icon: 'fas fa-bars', order: 4 }, // Updated icon
                ]
            },

            // Content Management
            {
                label: 'Konten Website', url: '#', icon: 'fas fa-globe', parent_id: null, order: 3, children: [
                    { label: 'Berita & Artikel', url: '/articles', icon: 'fas fa-newspaper', order: 1 },
                    { label: 'Galeri', url: '/galleries', icon: 'fas fa-images', order: 2 },
                    { label: 'Banners', url: '/banners', icon: 'fas fa-image', order: 3 },
                    { label: 'Public Navbars', url: '/navbars', icon: 'fas fa-compass', order: 4 },
                    { label: 'Sambutan', url: '/welcome', icon: 'fas fa-hand-holding-heart', order: 5 },
                ]
            },

            // Settings
            { label: 'Settings', url: '/settings', icon: 'fas fa-cog', parent_id: null, order: 4 }
        ];

        // 3. Recursive Function to Insert Menus
        const insertMenus = async (menuList, parentId = null) => {
            for (const menu of menuList) {
                // Check if menu exists by URL and Label to avoid duplicates but allow updates
                let menuId;
                const [existing] = await queryInterface.sequelize.query(
                    `SELECT id FROM Menus WHERE url = '${menu.url}' AND label = '${menu.label}' LIMIT 1`
                );

                if (existing.length > 0) {
                    menuId = existing[0].id;
                    // Update parent_id and order if needed
                    if (parentId) {
                        await queryInterface.sequelize.query(
                            `UPDATE Menus SET parent_id = ${parentId}, \`order\` = ${menu.order}, icon = '${menu.icon}' WHERE id = ${menuId}`
                        );
                    }
                } else {
                    const [result] = await queryInterface.sequelize.query(
                        `INSERT INTO Menus (label, url, icon, parent_id, \`order\`, createdAt, updatedAt) 
                     VALUES ('${menu.label}', '${menu.url}', '${menu.icon}', ${parentId ? parentId : 'NULL'}, ${menu.order}, NOW(), NOW())`
                    );
                    menuId = result;
                }

                // Grant Permission to Admin
                const [perm] = await queryInterface.sequelize.query(
                    `SELECT id FROM RoleMenuPermissions WHERE role_id = ${adminRoleId} AND menu_id = ${menuId}`
                );
                if (perm.length === 0) {
                    await queryInterface.sequelize.query(
                        `INSERT INTO RoleMenuPermissions (role_id, menu_id, can_view, can_create, can_update, can_delete, createdAt, updatedAt)
                     VALUES (${adminRoleId}, ${menuId}, 1, 1, 1, 1, NOW(), NOW())`
                    );
                }

                // Process Children
                if (menu.children) {
                    await insertMenus(menu.children, menuId);
                }
            }
        };

        await insertMenus(menus);
        console.log('Admin menus seeded based on router structure.');
    },

    async down(queryInterface, Sequelize) {
        // We don't want to delete everything blindly, maybe just specific ones logic.
        // For now, keep empty to avoid accidental data loss.
    }
};
