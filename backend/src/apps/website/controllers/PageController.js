const { Page } = require('../models');

module.exports = {
    // Admin: List pages
    async index(req, res) {
        try {
            const pages = await Page.findAll({ order: [['createdAt', 'DESC']] });
            res.json(pages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Admin: Get by ID
    async show(req, res) {
        try {
            const page = await Page.findByPk(req.params.id);
            if (!page) return res.status(404).json({ message: 'Page not found' });
            res.json(page);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Admin: Create page
    async create(req, res) {
        try {
            const page = await Page.create(req.body);
            res.status(201).json(page);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Admin: Update page
    async update(req, res) {
        try {
            const page = await Page.findByPk(req.params.id);
            if (!page) return res.status(404).json({ message: 'Page not found' });
            await page.update(req.body);
            res.json(page);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Admin: Delete page
    async delete(req, res) {
        try {
            const page = await Page.findByPk(req.params.id);
            if (!page) return res.status(404).json({ message: 'Page not found' });
            await page.destroy();
            res.json({ message: 'Page deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Public: Find by slug
    async findBySlug(req, res) {
        try {
            const page = await Page.findOne({ where: { slug: req.params.slug, is_active: true } });
            if (!page) return res.status(404).json({ message: 'Page not found' });
            res.json(page);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
