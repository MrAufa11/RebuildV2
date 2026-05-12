const { Role, Menu, RoleMenuPermissions } = require('../models');

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const syncPermissions = async (roleId, permissions) => {

    if (!permissions || !Array.isArray(permissions)) {
        return;
    }

    const menus = await Menu.findAll();

    const permMap = {};

    permissions.forEach(p => {
        const parts = p.split('.');
        if (parts.length === 2) {
            const slug = parts[0];
            const action = parts[1];

            if (!permMap[slug]) {
                permMap[slug] = { can_view: false, can_create: false, can_update: false, can_delete: false };
            }

            if (action === 'read') permMap[slug].can_view = true;
            if (action === 'create') permMap[slug].can_create = true;
            if (action === 'update') permMap[slug].can_update = true;
            if (action === 'delete') permMap[slug].can_delete = true;
        }
    });


    const permissionData = [];
    menus.forEach(menu => {
        const slug = slugify(menu.label);
        if (permMap[slug]) {
            permissionData.push({
                role_id: roleId,
                menu_id: menu.id,
                ...permMap[slug]
            });
        }
    });


    await RoleMenuPermissions.destroy({ where: { role_id: roleId } });

    if (permissionData.length > 0) {
        await RoleMenuPermissions.bulkCreate(permissionData);
    } else {
    }
};

const RoleController = {
    // Create Role
    async create(req, res) {
        try {
            const { name, permissions } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Role name is required' });
            }

            const existingRole = await Role.findOne({ where: { name } });
            if (existingRole) {
                return res.status(400).json({ message: 'Role already exists' });
            }

            const newRole = await Role.create({ name });

            if (permissions) {
                await syncPermissions(newRole.id, permissions);
            }

            return res.status(201).json({
                message: 'Role created successfully',
                data: newRole
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating role', error: error.message });
        }
    },

    // Get All Roles
    async getAll(req, res) {
        try {
            const roles = await Role.findAll();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching roles', error: error.message });
        }
    },

    // Get One Role
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id, {
                include: [{
                    model: Menu,
                    as: 'menus',
                    attributes: ['id', 'label'],
                    through: {
                        attributes: ['can_view', 'can_create', 'can_update', 'can_delete']
                    }
                }]
            });

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            // Transform for frontend
            const roleJson = role.toJSON();
            const permissions = [];

            if (roleJson.menus) {
                roleJson.menus.forEach(menu => {
                    const slug = slugify(menu.label);
                    const perms = menu.RoleMenuPermissions;

                    if (perms) {
                        if (perms.can_view) permissions.push(`${slug}.read`);
                        if (perms.can_create) permissions.push(`${slug}.create`);
                        if (perms.can_update) permissions.push(`${slug}.update`);
                        if (perms.can_delete) permissions.push(`${slug}.delete`);
                    }
                });
                delete roleJson.menus; // Clean up
            }

            roleJson.permissions = permissions;

            return res.status(200).json(roleJson);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching role', error: error.message });
        }
    },

    // Update Role
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            await role.update({ name });

            // Handle permissions
            if (permissions) {
                await syncPermissions(role.id, permissions);
            }

            return res.status(200).json({
                message: 'Role updated successfully',
                data: role
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating role', error: error.message });
        }
    },

    // Delete Role
    async delete(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            // Delete associated permissions first (cascade should handle this but to be safe)
            await RoleMenuPermissions.destroy({ where: { role_id: id } });

            await role.destroy();
            return res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting role', error: error.message });
        }
    }
};

module.exports = RoleController;
