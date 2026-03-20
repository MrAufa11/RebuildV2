const db = require('../models');

async function addSpmbMenu() {
    try {
        console.log('🚀 Adding SPMB Menu...');

        // 1. Create or Find Menu "Pendaftar"
        const [menu, created] = await db.Menu.findOrCreate({
            where: { label: 'Pendaftar' },
            defaults: {
                url: '/registrants',
                icon: 'fas fa-user-plus',
                order: 10, // Adjust order as needed
                parent_id: null
            }
        });

        if (created) {
            console.log('✅ Menu "Pendaftar" created.');
        } else {
            console.log('ℹ️ Menu "Pendaftar" already exists.');
        }

        // 2. Grant permissions to Admin (Role ID 1 usually, or find by name)
        const adminRole = await db.Role.findOne({ where: { name: 'Admin' } }); // Adjust role name if needed ("Super Admin"?)

        if (!adminRole) {
            console.error('❌ Role "Admin" not found! Trying ID 1...');
            // Fallback to ID 1
            const role1 = await db.Role.findByPk(1);
            if (role1) {
                await grantPermissions(role1, menu);
            } else {
                console.error('❌ Role ID 1 not found either.');
            }
        } else {
            await grantPermissions(adminRole, menu);
        }

    } catch (error) {
        console.error('❌ Error adding SPMB menu:', error);
    } finally {
        process.exit();
    }
}

async function grantPermissions(role, menu) {
    const [permission, created] = await db.RoleMenuPermissions.findOrCreate({
        where: {
            role_id: role.id,
            menu_id: menu.id
        },
        defaults: {
            can_view: true,
            can_create: true,
            can_update: true,
            can_delete: true
        }
    });

    if (created) {
        console.log(`✅ Permissions granted for Role "${role.name}" on Menu "${menu.label}".`);
    } else {
        console.log(`ℹ️ Permissions already exist for Role "${role.name}" on Menu "${menu.label}".`);
        // Ensure they are true
        await permission.update({
            can_view: true,
            can_create: true,
            can_update: true,
            can_delete: true
        });
        console.log(`✅ Permissions updated for Role "${role.name}".`);

    }
}

addSpmbMenu();
