const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SpmbToken extends Model {
        static associate(models) {
            SpmbToken.belongsTo(models.StudentUser, { foreignKey: 'student_id', as: 'student' });
        }
    }
    SpmbToken.init({
        token: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
        is_revoked: DataTypes.BOOLEAN,
        student_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'SpmbToken',
    });
    return SpmbToken;
};
