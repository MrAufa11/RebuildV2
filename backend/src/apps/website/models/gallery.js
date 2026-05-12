const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Gallery extends Model {
        static associate(models) {
            Gallery.belongsTo(models.WebsiteCategory, { foreignKey: 'category_id', as: 'website_category' });
        }
    }
    Gallery.init({
        title: DataTypes.STRING,
        image_url: DataTypes.STRING,
        description: DataTypes.TEXT,
        category_id: DataTypes.INTEGER
    }, { sequelize, modelName: 'Gallery' });
    return Gallery;
};
