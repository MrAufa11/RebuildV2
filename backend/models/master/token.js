'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        static associate(models) {
            Token.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }
    Token.init({
        token: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
        is_revoked: DataTypes.BOOLEAN,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Token',
    });
    return Token;
};
