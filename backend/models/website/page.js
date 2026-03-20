const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Page extends Model { }
    Page.init({
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        content: DataTypes.TEXT,
        is_active: DataTypes.BOOLEAN
    }, { sequelize, modelName: 'Page' });
    return Page;
};
