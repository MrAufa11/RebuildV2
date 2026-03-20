'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Registrant extends Model {
        static associate(models) {
            // Associations can be defined here
        }
    }
    Registrant.init({
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: DataTypes.TEXT,
        entryPath: {
            type: DataTypes.ENUM('Reguler', 'Prestasi', 'Indent'),
            defaultValue: 'Reguler'
        },
        schoolOrigin: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending' // Pending, Approved, Exam, Graduated, Re-registered, Rejected
        },
        notes: DataTypes.TEXT,
        subEntryPath: DataTypes.STRING,
        birthPlace: DataTypes.STRING,
        birthDate: DataTypes.DATEONLY,
        gender: DataTypes.ENUM('Laki-Laki', 'Perempuan'),
        religion: DataTypes.STRING,
        schoolLevel: DataTypes.STRING,
        wave: DataTypes.STRING,
        registrationYear: DataTypes.STRING,
        registration_batch_id: DataTypes.INTEGER,
        registration_path_id: DataTypes.INTEGER,
        registration_sub_path_id: DataTypes.INTEGER,
        education_level_id: DataTypes.INTEGER,

        // New Workflow Fields
        paymentProof: DataTypes.STRING,
        paymentStatus: {
            type: DataTypes.STRING,
            defaultValue: 'Unpaid'
        },
        reRegistrationProof: DataTypes.STRING,
        documentUrl: DataTypes.STRING,
        nisn: DataTypes.STRING,
        voucherCode: DataTypes.STRING,
        discountAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        biodataLengkap: DataTypes.JSON
    }, {
        sequelize,
        modelName: 'Registrant',
    });
    return Registrant;
};
