const { Gallery, WebsiteCategory } = require('../models');

const GalleryController = {
    async getAllPublic(req, res) {
        try {
            const whereClause = {};
            if (req.query.category) {
                // If category slug passed
                const cat = await WebsiteCategory.findOne({ where: { slug: req.query.category, type: 'gallery' } });
                if (cat) whereClause.category_id = cat.id;
            }

            const galleries = await Gallery.findAll({
                where: whereClause,
                include: [{ model: WebsiteCategory, as: 'website_category', attributes: ['id', 'name', 'slug'] }],
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(galleries);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching galleries', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const galleries = await Gallery.findAll({
                include: [{ model: WebsiteCategory, as: 'website_category' }],
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(galleries);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching galleries', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const gallery = await Gallery.findByPk(id);
            if (!gallery) return res.status(404).json({ message: 'Gallery item not found' });
            return res.status(200).json(gallery);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching gallery item', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const gallery = await Gallery.findByPk(id);
            if (!gallery) return res.status(404).json({ message: 'Gallery item not found' });
            await gallery.update(req.body);
            return res.status(200).json({ message: 'Gallery item updated', data: gallery });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating gallery item', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const gallery = await Gallery.create(req.body);
            return res.status(201).json({ message: 'Gallery item created', data: gallery });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating gallery item', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const item = await Gallery.findByPk(id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            await item.destroy();
            return res.status(200).json({ message: 'Item deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting item', error: error.message });
        }
    }
};

module.exports = GalleryController;
