const { RoleMenuPermissions, Role, Menu } = require('../models');

const RolePermissionController = {
    // Assign or Update Permission
    async assignPermission(req, res) {
        try {
            const { role_id, menu_id, can_view, can_create, can_update, can_delete } = req.body;

            if (!role_id || !menu_id) {
                return res.status(400).json({ message: 'role_id and menu_id are required' });
            }

            // Verify existence
            const role = await Role.findByPk(role_id);
            const menu = await Menu.findByPk(menu_id);

            if (!role || !menu) {
                return res.status(404).json({ message: 'Role or Menu not found' });
            }

            // Find existing permission
            let permission = await RoleMenuPermissions.findOne({
                where: { role_id, menu_id }
            });

            const data = {
                // Determine values: use explicit 1/0 check or default to false/0
                can_view: can_view == 1,
                can_create: can_create == 1,
                can_update: can_update == 1,
                can_delete: can_delete == 1
            };

            if (permission) {
                await permission.update(data);
            } else {
                permission = await RoleMenuPermissions.create({
                    role_id,
                    menu_id,
                    ...data
                });
            }

            // Helper to format output as 1/0
            const formatOutput = (p) => ({
                id: p.id,
                role_id: p.role_id,
                menu_id: p.menu_id,
                can_view: p.can_view ? 1 : 0,
                can_create: p.can_create ? 1 : 0,
                can_update: p.can_update ? 1 : 0,
                can_delete: p.can_delete ? 1 : 0,
                updatedAt: p.updatedAt,
                createdAt: p.createdAt
            });

            return res.status(200).json({
                message: 'Permission updated successfully',
                data: formatOutput(permission)
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating permission', error: error.message });
        }
    },

    // Get Permissions for a Role
    async getByRole(req, res) {
        try {
            const { role_id } = req.params;

            // Check role exists
            const role = await Role.findByPk(role_id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            const permissions = await RoleMenuPermissions.findAll({
                where: { role_id },
                include: [
                    // Optional: Include Menu details if context allows, but model definition might need explicit assoc setup
                    // The previous model file showed 'associate' empty for RoleMenuPermissions?
                    // Let's check Role.js -> Role.belongsToMany(Menu, { through: 'RoleMenuPermissions' ... })
                    // Usually we query Role with include Menu to get this. 
                    // But querying the table directly is also fine.
                ]
            });

            // Format 1/0
            const formatted = permissions.map(p => ({
                id: p.id,
                role_id: p.role_id,
                menu_id: p.menu_id,
                can_view: p.can_view ? 1 : 0,
                can_create: p.can_create ? 1 : 0,
                can_update: p.can_update ? 1 : 0,
                can_delete: p.can_delete ? 1 : 0,
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching permissions', error: error.message });
        }
    }
};

module.exports = RolePermissionController;
