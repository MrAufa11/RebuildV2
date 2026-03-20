const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banner extends Model { }
    Banner.init({
        title: DataTypes.STRING,
        subtitle: DataTypes.STRING,
        description: DataTypes.TEXT,
        image_url: DataTypes.STRING,
        button_text: DataTypes.STRING,
        button_url: DataTypes.STRING,
        order: DataTypes.INTEGER,
        is_active: DataTypes.BOOLEAN
    }, { sequelize, modelName: 'Banner' });
    return Banner;
};
