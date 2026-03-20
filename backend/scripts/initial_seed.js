const db = require('../models');
const bcrypt = require('bcrypt');

async function seedData() {
    try {
        console.log('🌱 Seeding Initial Data...');

        // 1. Create Apps
        const appsData = [
            { code: 'website', name: 'Website Utama', description: 'Content Management System' },
            { code: 'spmb', name: 'SPMB', description: 'Sistem Penerimaan Mahasiswa Baru' },
            { code: 'keuangan', name: 'Keuangan', description: 'Sistem Keuangan' }
        ];

        const apps = {};
        for (const app of appsData) {
            const [record] = await db.App.findOrCreate({
                where: { code: app.code },
                defaults: app
            });
            apps[app.code] = record;
            console.log(`✅ App "${app.name}" ready.`);
        }

        // 2. Roles
        // Super Admin (Global Access - No App ID)
        const [superAdminRole] = await db.Role.findOrCreate({
            where: { name: 'Super Admin' },
            defaults: { name: 'Super Admin', app_id: null }
        });

        // App Specific Admins
        const [websiteAdmin] = await db.Role.findOrCreate({
            where: { name: 'Website Admin' },
            defaults: { name: 'Website Admin', app_id: apps.website.id }
        });

        const [spmbAdmin] = await db.Role.findOrCreate({
            where: { name: 'SPMB Admin' },
            defaults: { name: 'SPMB Admin', app_id: apps.spmb.id }
        });

        console.log('✅ Roles created/verified.');


        // 3. Admin User (Super Admin)
        const hashedPassword = await bcrypt.hash('password123', 10);
        const [adminUser] = await db.User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: {
                username: 'admin',
                password: hashedPassword,
                role_id: superAdminRole.id
            }
        });
        console.log('✅ Super Admin User (admin@example.com).');

        // Website Admin User
        const [webUser] = await db.User.findOrCreate({
            where: { email: 'webadmin@example.com' },
            defaults: {
                username: 'webadmin',
                password: hashedPassword,
                role_id: websiteAdmin.id
            }
        });
        console.log('✅ Website Admin User (webadmin@example.com).');

        // SPMB Admin User
        const [spmbUser] = await db.User.findOrCreate({
            where: { email: 'spmbadmin@example.com' },
            defaults: {
                username: 'spmbadmin',
                password: hashedPassword,
                role_id: spmbAdmin.id
            }
        });
        console.log('✅ SPMB Admin User (spmbadmin@example.com).');


        // 4. Seeding Menus per App

        // === Website Menus ===
        const websiteMenusData = [
            { label: 'Dashboard', url: '/admin/dashboard', icon: 'fas fa-home', order: 1, app_id: apps.website.id },
            { label: 'Articles', url: '/admin/articles', icon: 'fas fa-newspaper', order: 2, app_id: apps.website.id },
            { label: 'Pages', url: '/admin/pages', icon: 'fas fa-file', order: 3, app_id: apps.website.id },
            { label: 'Galleries', url: '/admin/galleries', icon: 'fas fa-images', order: 4, app_id: apps.website.id },
            { label: 'Teachers', url: '/admin/teachers', icon: 'fas fa-chalkboard-teacher', order: 5, app_id: apps.website.id },
            { label: 'Banners', url: '/admin/banners', icon: 'fas fa-image', order: 6, app_id: apps.website.id },
            { label: 'Settings', url: '/admin/settings', icon: 'fas fa-cogs', order: 99, app_id: apps.website.id }
        ];

        for (const m of websiteMenusData) {
            const [menu] = await db.Menu.findOrCreate({
                where: { label: m.label, app_id: m.app_id },
                defaults: m
            });
            // Assign to Website Admin & Super Admin
            await db.RoleMenuPermissions.findOrCreate({ where: { role_id: websiteAdmin.id, menu_id: menu.id }, defaults: { can_view: true } });
            await db.RoleMenuPermissions.findOrCreate({ where: { role_id: superAdminRole.id, menu_id: menu.id }, defaults: { can_view: true } });
        }
        console.log('✅ Website Menus seeded.');

        // === SPMB Menus ===
        const spmbMenusData = [
            { label: 'Dashboard', url: '/admin/dashboard', icon: 'fas fa-home', order: 1, app_id: apps.spmb.id },
            { label: 'Registrants', url: '/admin/registrants', icon: 'fas fa-user-plus', order: 2, app_id: apps.spmb.id },
            { label: 'Reports', url: '/admin/reports', icon: 'fas fa-chart-bar', order: 3, app_id: apps.spmb.id },
            { label: 'Settings', url: '/admin/settings', icon: 'fas fa-cogs', order: 99, app_id: apps.spmb.id }
        ];

        for (const m of spmbMenusData) {
            const [menu] = await db.Menu.findOrCreate({
                where: { label: m.label, app_id: m.app_id },
                defaults: m
            });
            // Assign to SPMB Admin & Super Admin
            await db.RoleMenuPermissions.findOrCreate({ where: { role_id: spmbAdmin.id, menu_id: menu.id }, defaults: { can_view: true } });
            await db.RoleMenuPermissions.findOrCreate({ where: { role_id: superAdminRole.id, menu_id: menu.id }, defaults: { can_view: true } });
        }
        console.log('✅ SPMB Menus seeded.');

        // === Keuangan Menus ===
        const keuanganMenusData = [
            { label: 'Dashboard', url: '/admin/dashboard', icon: 'fas fa-home', order: 1, app_id: apps.keuangan.id },
            { label: 'Transactions', url: '/admin/transactions', icon: 'fas fa-money-bill', order: 2, app_id: apps.keuangan.id },
            { label: 'Categories', url: '/admin/categories', icon: 'fas fa-list', order: 3, app_id: apps.keuangan.id }
        ];

        // Find Keuangan Admin Role (if exists in future, or just Super Admin for now)
        // For now, assign to Super Admin
        for (const m of keuanganMenusData) {
            const [menu] = await db.Menu.findOrCreate({
                where: { label: m.label, app_id: m.app_id },
                defaults: m
            });
            await db.RoleMenuPermissions.findOrCreate({ where: { role_id: superAdminRole.id, menu_id: menu.id }, defaults: { can_view: true } });
        }
        console.log('✅ Keuangan Menus seeded.');

        // Clean up old menus if any (menus without app_id) - OPTIONAL
        // await db.Menu.destroy({ where: { app_id: null } });

        console.log('✅ Menus & Permissions seeded.');
        console.log('✅ Seed complete.');

    } catch (error) {
        console.error('❌ Seeding Error:', error);
    } finally {
        process.exit();
    }
}

seedData();
