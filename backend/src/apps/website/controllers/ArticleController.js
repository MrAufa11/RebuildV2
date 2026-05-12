const { Article, Category, User } = require('../models');

const ArticleController = {
    async getAllPublic(req, res) {
        try {
            const articles = await Article.findAll({
                where: { status: 'published' },
                include: [
                    { model: Category, as: 'category' }
                ],
                order: [['published_at', 'DESC']]
            });

            // Manual fetch for User (Master DB) because cannot include cross-db
            const authorIds = [...new Set(articles.map(a => a.author_id).filter(id => id))];

            if (authorIds.length > 0) {
                const users = await User.findAll({
                    where: { id: authorIds },
                    attributes: ['id', 'username']
                });

                const userMap = {};
                users.forEach(u => userMap[u.id] = u);

                // Attach author manually
                // We need to return JSON, so map instances to JSON first if needed, 
                // or just modify dataValues.
                return res.status(200).json(articles.map(article => {
                    const plainArticle = article.toJSON();
                    if (plainArticle.author_id && userMap[plainArticle.author_id]) {
                        plainArticle.author = { username: userMap[plainArticle.author_id].username };
                    }
                    return plainArticle;
                }));
            }

            return res.status(200).json(articles);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching articles', error: error.message });
        }
    },

    async getOnePublic(req, res) {
        try {
            const { slug } = req.params;
            const article = await Article.findOne({
                where: { slug, status: 'published' },
                include: [
                    { model: Category, as: 'category' }
                ]
            });

            if (!article) return res.status(404).json({ message: 'Article not found' });

            const plainArticle = article.toJSON();
            if (plainArticle.author_id) {
                const user = await User.findByPk(plainArticle.author_id, {
                    attributes: ['username']
                });
                if (user) {
                    plainArticle.author = { username: user.username };
                }
            }

            return res.status(200).json(plainArticle);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching article', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const articles = await Article.findAll({
                include: [{ model: Category, as: 'category' }]
            });
            return res.status(200).json(articles);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching articles', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id, {
                include: [{ model: Category, as: 'category' }]
            });
            if (!article) return res.status(404).json({ message: 'Article not found' });
            return res.status(200).json(article);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching article', error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { title, content, category_id, status, image_url, excerpt } = req.body;
            // Simple slug generation
            const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const article = await Article.create({
                title, slug, content, category_id, status, image_url, excerpt,
                author_id: req.userId, // From middleware
                published_at: status === 'published' ? new Date() : null
            });
            return res.status(201).json({ message: 'Article created', data: article });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating article', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) return res.status(404).json({ message: 'Article not found' });

            // Check slug update if title changes (optional, simplified here)
            await article.update(req.body);
            return res.status(200).json({ message: 'Article updated', data: article });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating article', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) return res.status(404).json({ message: 'Article not found' });
            await article.destroy();
            return res.status(200).json({ message: 'Article deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting article', error: error.message });
        }
    }
};

module.exports = ArticleController;
