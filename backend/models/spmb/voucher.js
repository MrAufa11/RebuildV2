module.exports = (sequelize, DataTypes) => {
    const Voucher = sequelize.define('Voucher', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        discount_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        max_usage: {
            type: DataTypes.INTEGER,
            allowNull: true, // null means unlimited
        },
        current_usage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        valid_until: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'vouchers',
        timestamps: true, // adds createdAt and updatedAt
        getterMethods: {
            isValid() {
                if (!this.is_active) return false;
                if (this.valid_until && new Date() > new Date(this.valid_until)) return false;
                if (this.max_usage !== null && this.current_usage >= this.max_usage) return false;
                return true;
            }
        }
    });

    return Voucher;
};
