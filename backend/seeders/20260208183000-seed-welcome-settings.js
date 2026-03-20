'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Get Settings Menu ID
        const [settingsMenu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE label = 'Settings' AND parent_id IS NULL LIMIT 1;`
        );

        // We can add it as top level or under settings. Let's add it under Settings for organization, 
        // or as a top level content block. The user said "buatkan master", typically implies a new menu item.
        // Let's create a "Konten" (Content) group maybe? Or just root level "Sambutan".
        // Let's go with Root Level "Sambutan" for high visibility as requested.

        // Check if exists
        const [existingMenu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE url = '/welcome' LIMIT 1;`
        );

        let menuId;
        if (!existingMenu || existingMenu.length === 0) {
            await queryInterface.bulkInsert('Menus', [{
                label: 'Sambutan',
                url: '/welcome',
                icon: 'fas fa-hand-holding-heart',
                parent_id: null, // Top level
                order: 3, // After Users/Roles/etc? Let's check existing order. Dashboard is prob 0-1.
                // Just put it somewhere visible.
                createdAt: now,
                updatedAt: now
            }]);

            const [newMenu] = await queryInterface.sequelize.query(
                `SELECT id FROM Menus WHERE url = '/welcome' LIMIT 1;`
            );
            menuId = newMenu[0].id;
        } else {
            menuId = existingMenu[0].id;
        }

        // 2. Grant Permission to Admin
        const [adminRole] = await queryInterface.sequelize.query(
            `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1;`
        );

        if (adminRole && adminRole.length > 0) {
            const adminRoleId = adminRole[0].id;

            const [existingPerm] = await queryInterface.sequelize.query(
                `SELECT id FROM RoleMenuPermissions WHERE role_id = ${adminRoleId} AND menu_id = ${menuId} LIMIT 1;`
            );

            if (!existingPerm || existingPerm.length === 0) {
                await queryInterface.bulkInsert('RoleMenuPermissions', [{
                    role_id: adminRoleId,
                    menu_id: menuId,
                    can_view: true,
                    can_create: true, // Though it's a settings page, CRUD permissions are standard
                    can_update: true,
                    can_delete: true,
                    createdAt: now,
                    updatedAt: now
                }]);
            }
        }

        // 3. Seed Initial Settings if empty
        // We use raw queries or just let the user fill it. 
        // But helpful to prefill with what's currently hardcoded in Vue so it doesn't break.
        const initialSettings = [
            { key: 'welcome_title', value: 'Membangun Fondasi <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500">Karakter Qur\'ani</span> di Era Digital' },
            { key: 'welcome_message', value: 'Selamat datang di MA Bina Insan Mulia Al-Mawahib. Kami percaya bahwa kecerdasan intelektual harus berjalan beriringan dengan kematangan spiritual. Kurikulum kami dirancang untuk menjawab tantangan zaman tanpa mencabut akar tradisi keislaman.' },
            { key: 'welcome_image', value: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80' },
            { key: 'principal_name', value: 'Drs. H. Ahmad Fauzi' },
            { key: 'principal_image', value: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { key: 'principal_quote', value: '"Pendidikan adalah senjata paling mematikan untuk mengubah dunia."' }
        ];

        for (const setting of initialSettings) {
            const [exists] = await queryInterface.sequelize.query(
                `SELECT id FROM Settings WHERE \`key\` = '${setting.key}' LIMIT 1;`
            );
            if (!exists || exists.length === 0) {
                await queryInterface.bulkInsert('Settings', [{
                    key: setting.key,
                    value: setting.value,
                    type: 'text', // default
                    group: 'welcome',
                    createdAt: now,
                    updatedAt: now
                }]);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        const [menu] = await queryInterface.sequelize.query(
            `SELECT id FROM Menus WHERE url = '/welcome' LIMIT 1;`
        );
        if (menu && menu.length > 0) {
            await queryInterface.bulkDelete('RoleMenuPermissions', { menu_id: menu[0].id });
            await queryInterface.bulkDelete('Menus', { id: menu[0].id });
        }
    }
};
