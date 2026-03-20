'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Get Admin Roles ID
        const [superAdminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'Super Admin' LIMIT 1;`
        );
        const [spmbAdminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'SPMB Admin' LIMIT 1;`
        );
        if (!superAdminRole || superAdminRole.length === 0) return;
        const superAdminRoleId = superAdminRole[0].id;
        const spmbAdminRoleId = spmbAdminRole && spmbAdminRole.length > 0 ? spmbAdminRole[0].id : null;

        // 2. Get SPMB App ID
        const [spmbApp] = await queryInterface.sequelize.query(
            `SELECT id FROM Apps WHERE code = 'spmb' LIMIT 1;`
        );
        if (!spmbApp || spmbApp.length === 0) return;
        const spmbAppId = spmbApp[0].id;

        // Clean up previous SPMB Menus if replacing them
        await queryInterface.sequelize.query(
            `DELETE FROM Menus WHERE app_id = ${spmbAppId};`
        );

        // 3. Define Menu Structure based on Router
        const menus = [
            // Dashboard
            { label: 'Dashboard', url: '/admin', icon: 'fas fa-home', parent_id: null, order: 1 },

            // Master Data Group
            {
                label: 'Master Data', url: '#', icon: 'fas fa-database', parent_id: null, order: 2, children: [
                    { label: 'Users', url: '/users', icon: 'fas fa-users', order: 1 },
                    { label: 'Roles', url: '/roles', icon: 'fas fa-user-tag', order: 2 },
                    { label: 'Teachers', url: '/teachers', icon: 'fas fa-chalkboard-teacher', order: 3 },
                    { label: 'Data Menu', url: '/menus', icon: 'fas fa-bars', order: 4 },
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

            // SPMB specific
            {
                label: 'SPMB Data', url: '#', icon: 'fas fa-clipboard-list', parent_id: null, order: 4, children: [
                    { label: 'Pendaftar', url: '/registrants', icon: 'fas fa-user-graduate', order: 1 }
                ]
            },

            // Data Referensi
            {
                label: 'Data Referensi', url: '#', icon: 'fas fa-book', parent_id: null, order: 5, children: [
                    { label: 'Gelombang', url: '/registration-batch', icon: 'fas fa-layer-group', order: 1 },
                    { label: 'Jalur Pendaftaran', url: '/registration-path', icon: 'fas fa-road', order: 2 },
                    { label: 'Sub Jalur', url: '/registration-sub-path', icon: 'fas fa-code-branch', order: 3 },
                    { label: 'Jenjang Pendidikan', url: '/education-level', icon: 'fas fa-graduation-cap', order: 4 },
                    { label: 'Tahun Ajaran', url: '/academic-year-setup', icon: 'fas fa-calendar-alt', order: 5 },
                    { label: 'Agama', url: '/religion', icon: 'fas fa-pray', order: 6 },
                    { label: 'Pekerjaan', url: '/occupation', icon: 'fas fa-briefcase', order: 7 },
                    { label: 'Penghasilan', url: '/income', icon: 'fas fa-money-bill-wave', order: 8 },
                    { label: 'Status Hidup', url: '/life-status', icon: 'fas fa-heartbeat', order: 9 },
                    { label: 'Bank', url: '/bank', icon: 'fas fa-university', order: 10 },
                    { label: 'Voucher', url: '/voucher', icon: 'fas fa-ticket-alt', order: 11 },
                ]
            },

            // Settings
            { label: 'Settings', url: '/settings', icon: 'fas fa-cog', parent_id: null, order: 6 }
        ];

        // 4. Recursive Function to Insert Menus
        const insertMenus = async (menuList, parentId = null) => {
            for (const menu of menuList) {
                // Check if menu exists
                let menuId;
                const [existing] = await queryInterface.sequelize.query(
                    `SELECT id FROM Menus WHERE url = '${menu.url}' AND label = '${menu.label}' AND app_id = ${spmbAppId} LIMIT 1`
                );

                if (existing.length > 0) {
                    menuId = existing[0].id;
                    if (parentId) {
                        await queryInterface.sequelize.query(
                            `UPDATE Menus SET parent_id = ${parentId}, \`order\` = ${menu.order}, icon = '${menu.icon}' WHERE id = ${menuId}`
                        );
                    }
                } else {
                    const [result] = await queryInterface.sequelize.query(
                        `INSERT INTO Menus (label, url, icon, parent_id, \`order\`, app_id, createdAt, updatedAt) 
                     VALUES ('${menu.label}', '${menu.url}', '${menu.icon}', ${parentId ? parentId : 'NULL'}, ${menu.order}, ${spmbAppId}, NOW(), NOW())`
                    );
                    menuId = result;
                }

                // Grant Permission to Super Admin
                const [permSuper] = await queryInterface.sequelize.query(
                    `SELECT role_id FROM RoleMenuPermissions WHERE role_id = ${superAdminRoleId} AND menu_id = ${menuId} LIMIT 1`
                );
                if (permSuper.length === 0) {
                    await queryInterface.sequelize.query(
                        `INSERT INTO RoleMenuPermissions (role_id, menu_id, can_view, can_create, can_update, can_delete, createdAt, updatedAt)
                     VALUES (${superAdminRoleId}, ${menuId}, 1, 1, 1, 1, NOW(), NOW())`
                    );
                }

                if (spmbAdminRoleId) {
                    const [permSpmb] = await queryInterface.sequelize.query(
                        `SELECT role_id FROM RoleMenuPermissions WHERE role_id = ${spmbAdminRoleId} AND menu_id = ${menuId} LIMIT 1`
                    );
                    if (permSpmb.length === 0) {
                        await queryInterface.sequelize.query(
                            `INSERT INTO RoleMenuPermissions (role_id, menu_id, can_view, can_create, can_update, can_delete, createdAt, updatedAt)
                         VALUES (${spmbAdminRoleId}, ${menuId}, 1, 1, 1, 1, NOW(), NOW())`
                        );
                    }
                }

                // Process Children
                if (menu.children) {
                    await insertMenus(menu.children, menuId);
                }
            }
        };

        await insertMenus(menus);
        console.log('SPMB Admin menus seeded based on requested structure.');

        // Let's also make sure admin user has spmb access in UserAppAccess ?
        // Or if the portal logic applies, we give admin user the spmb role.
    },

    async down(queryInterface, Sequelize) {
        // Safe down
    }
};
