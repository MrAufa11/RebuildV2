const { Navbar } = require('../models');

const NavbarController = {
    async create(req, res) {
        try {
            const { label, url, icon, order, parent_id } = req.body;

            if (parent_id) {
                const parent = await Navbar.findByPk(parent_id);
                if (!parent) {
                    return res.status(404).json({ message: 'Parent navbar not found' });
                }
            }

            const newNavbar = await Navbar.create({
                label,
                url,
                icon,
                order: order || 0,
                parent_id: parent_id || null
            });

            return res.status(201).json({
                message: 'Navbar created successfully',
                data: newNavbar
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating navbar', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const navbars = await Navbar.findAll({
                order: [['order', 'ASC'], ['id', 'ASC']]
            });

            const navbarList = navbars.map(m => m.get({ plain: true }));

            const rootNavbars = [];
            const lookup = {};

            navbarList.forEach(navbar => {
                navbar.children = [];
                lookup[navbar.id] = navbar;
            });

            navbarList.forEach(navbar => {
                if (navbar.parent_id) {
                    if (lookup[navbar.parent_id]) {
                        lookup[navbar.parent_id].children.push(navbar);
                    } else {
                        rootNavbars.push(navbar);
                    }
                } else {
                    rootNavbars.push(navbar);
                }
            });

            return res.status(200).json(rootNavbars);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching navbars', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const navbar = await Navbar.findByPk(id, {
                include: [
                    { model: Navbar, as: 'parent' },
                    { model: Navbar, as: 'children' }
                ]
            });
            if (!navbar) {
                return res.status(404).json({ message: 'Navbar not found' });
            }
            return res.status(200).json(navbar);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching navbar', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { label, url, icon, order, parent_id } = req.body;
            const navbar = await Navbar.findByPk(id);

            if (!navbar) {
                return res.status(404).json({ message: 'Navbar not found' });
            }

            if (parent_id && parent_id == id) {
                return res.status(400).json({ message: 'Cannot set navbar as its own parent' });
            }

            await navbar.update({ label, url, icon, order, parent_id });

            return res.status(200).json({
                message: 'Navbar updated successfully',
                data: navbar
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating navbar', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const navbar = await Navbar.findByPk(id);

            if (!navbar) {
                return res.status(404).json({ message: 'Navbar not found' });
            }

            await navbar.destroy();
            return res.status(200).json({ message: 'Navbar deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting navbar', error: error.message });
        }
    },

    async reorder(req, res) {
        try {
            const items = req.body; // Expects [{ id: 1, order: 0 }, { id: 2, order: 1 }]

            if (!Array.isArray(items)) {
                return res.status(400).json({ message: 'Invalid data format. Expected array.' });
            }

            const updatePromises = items.map(item => {
                return Navbar.update({ order: item.order }, { where: { id: item.id } });
            });

            await Promise.all(updatePromises);

            return res.status(200).json({ message: 'Navbar order updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error reordering navbars', error: error.message });
        }
    }
};

module.exports = NavbarController;
