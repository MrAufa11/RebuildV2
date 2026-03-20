const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model { }
    Teacher.init({
        name: DataTypes.STRING,
        position: DataTypes.STRING,
        image_url: DataTypes.STRING,
        quote: DataTypes.TEXT,
        order: DataTypes.INTEGER,
        is_active: DataTypes.BOOLEAN
    }, { sequelize, modelName: 'Teacher' });
    return Teacher;
};
