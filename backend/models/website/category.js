const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WebsiteCategory extends Model {
        static associate(models) {
            WebsiteCategory.hasMany(models.Article, { foreignKey: 'category_id', as: 'articles' });
            WebsiteCategory.hasMany(models.Gallery, { foreignKey: 'category_id', as: 'galleries' });
        }
    }
    WebsiteCategory.init({
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        type: DataTypes.STRING
    }, { sequelize, modelName: 'WebsiteCategory', tableName: 'Categories' }); // Renamed to avoid conflict
    return WebsiteCategory;
};
