const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsTo(models.App, { foreignKey: 'app_id', as: 'app' });
            Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
            Role.belongsToMany(models.Menu, {
                through: 'RoleMenuPermissions',
                foreignKey: 'role_id',
                as: 'menus'
            });
        }
    }
    Role.init({
        name: DataTypes.STRING,
        app_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Apps',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};
