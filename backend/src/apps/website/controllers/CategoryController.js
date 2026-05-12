const { WebsiteCategory } = require('../models');

const CategoryController = {
    async getAll(req, res) {
        try {
            // Optional: filter by type if provided in query
            const whereClause = {};
            if (req.query.type) {
                whereClause.type = req.query.type;
            }
            const categories = await WebsiteCategory.findAll({ where: whereClause });
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching categories', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { name, type } = req.body;
            const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const category = await WebsiteCategory.create({ name, slug, type });
            return res.status(201).json({ message: 'Category created', data: category });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating category', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await WebsiteCategory.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            await category.destroy();
            return res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    }
};

module.exports = CategoryController;
