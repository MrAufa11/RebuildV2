const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Setting extends Model { }
    Setting.init({
        key: DataTypes.STRING,
        value: DataTypes.TEXT,
        type: DataTypes.STRING,
        group: DataTypes.STRING
    }, { sequelize, modelName: 'Setting' });
    return Setting;
};
