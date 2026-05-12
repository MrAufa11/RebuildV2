const { Menu, Role } = require('../models');

const MenuController = {
    async create(req, res) {
        try {
            const { label, url, icon, order, parent_id } = req.body;

            if (parent_id) {
                const parent = await Menu.findByPk(parent_id);
                if (!parent) {
                    return res.status(404).json({ message: 'Parent menu not found' });
                }
            }

            const newMenu = await Menu.create({
                label,
                url,
                icon,
                order: order || 0,
                parent_id: parent_id || null
            });

            return res.status(201).json({
                message: 'Menu created successfully',
                data: newMenu
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating menu', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const { app_id } = req.query;

            let whereCondition = {};

            if (app_id) {
                whereCondition = { app_id };
            }

            const menus = await Menu.findAll({
                where: whereCondition,
                order: [['order', 'ASC'], ['id', 'ASC']]
            });

            const menuList = menus.map(m => m.get({ plain: true }));

            const rootMenus = [];
            const lookup = {};

            menuList.forEach(menu => {
                menu.children = [];
                lookup[menu.id] = menu;
            });

            menuList.forEach(menu => {
                if (menu.parent_id) {
                    if (lookup[menu.parent_id]) {
                        lookup[menu.parent_id].children.push(menu);
                    } else {
                        rootMenus.push(menu);
                    }
                } else {
                    rootMenus.push(menu);
                }
            });

            return res.status(200).json(rootMenus);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching menus', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const menu = await Menu.findByPk(id, {
                include: [
                    { model: Menu, as: 'parent' },
                    { model: Menu, as: 'children' }
                ]
            });
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            return res.status(200).json(menu);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching menu', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { label, url, icon, order, parent_id } = req.body;
            const menu = await Menu.findByPk(id);

            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            if (parent_id && parent_id == id) {
                return res.status(400).json({ message: 'Cannot set menu as its own parent' });
            }

            await menu.update({ label, url, icon, order, parent_id });

            return res.status(200).json({
                message: 'Menu updated successfully',
                data: menu
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating menu', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const menu = await Menu.findByPk(id);

            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            await menu.destroy();
            return res.status(200).json({ message: 'Menu deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting menu', error: error.message });
        }
    },

    async reorder(req, res) {
        try {
            const items = req.body; // Expects [{ id: 1, order: 0 }, { id: 2, order: 1 }]

            if (!Array.isArray(items)) {
                return res.status(400).json({ message: 'Invalid data format. Expected array.' });
            }

            const updatePromises = items.map(item => {
                return Menu.update({ order: item.order }, { where: { id: item.id } });
            });

            await Promise.all(updatePromises);

            return res.status(200).json({ message: 'Menu order updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error reordering menus', error: error.message });
        }
    }
};

module.exports = MenuController;
