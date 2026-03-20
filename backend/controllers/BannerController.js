const { Banner } = require('../models');

const BannerController = {
    async getAllPublic(req, res) {
        try {
            const banners = await Banner.findAll({
                where: { is_active: true },
                order: [['order', 'ASC']]
            });
            return res.status(200).json(banners);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching banners', error: error.message });
        }
    },

    async getAll(req, res) { // Admin
        try {
            const banners = await Banner.findAll({ order: [['order', 'ASC']] });
            return res.status(200).json(banners);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching banners', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const banner = await Banner.findByPk(id);
            if (!banner) return res.status(404).json({ message: 'Banner not found' });
            return res.status(200).json(banner);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching banner', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const banner = await Banner.create(req.body);
            return res.status(201).json({ message: 'Banner created', data: banner });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating banner', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const banner = await Banner.findByPk(id);
            if (!banner) return res.status(404).json({ message: 'Banner not found' });
            await banner.update(req.body);
            return res.status(200).json({ message: 'Banner updated', data: banner });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating banner', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const banner = await Banner.findByPk(id);
            if (!banner) return res.status(404).json({ message: 'Banner not found' });
            await banner.destroy();
            return res.status(200).json({ message: 'Banner deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting banner', error: error.message });
        }
    }
};

module.exports = BannerController;
