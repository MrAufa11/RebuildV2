const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Article extends Model {
        static associate(models) {
            Article.belongsTo(models.WebsiteCategory, { foreignKey: 'category_id', as: 'category' });
            // User is in a different database (master_db), so we disable constraints
            Article.belongsTo(models.User, { foreignKey: 'author_id', as: 'author', constraints: false });
        }
    }
    Article.init({
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        excerpt: DataTypes.TEXT,
        content: DataTypes.TEXT,
        image_url: DataTypes.STRING,
        category_id: DataTypes.INTEGER,
        author_id: DataTypes.INTEGER,
        published_at: DataTypes.DATE,
        status: DataTypes.ENUM('draft', 'published', 'archived')
    }, { sequelize, modelName: 'Article' });
    return Article;
};
