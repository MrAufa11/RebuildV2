'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SchoolData extends Model {
        static associate(models) {
            // Associations
        }
    }
    SchoolData.init({
        province_code: DataTypes.STRING,
        city_code: DataTypes.STRING,
        district_code: DataTypes.STRING,
        school_code: DataTypes.STRING,
        school_name: DataTypes.STRING,
        address: DataTypes.STRING,
        sub_district: DataTypes.STRING,
        status: DataTypes.STRING,
        education_level: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        member_id: DataTypes.INTEGER,
        member_status: DataTypes.INTEGER,
        admission_status: DataTypes.INTEGER,
        logo: DataTypes.STRING,
        principal_photo: DataTypes.STRING,
        principal_name: DataTypes.STRING,
        keywords: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'SchoolData',
        tableName: 'school_data',
        timestamps: false
    });
    return SchoolData;
};
