'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // Association with SchoolData
            Student.belongsTo(models.SchoolData, {
                foreignKey: 'previous_school',
                as: 'school'
            });
        }
    }
    Student.init({
        registration_id: DataTypes.INTEGER,
        email: DataTypes.STRING,
        full_name: DataTypes.STRING,
        sequence_number: DataTypes.INTEGER,
        nism: DataTypes.STRING,
        nis: DataTypes.STRING,
        registration_year: DataTypes.INTEGER,
        grade_level: DataTypes.INTEGER,
        birth_place: DataTypes.TEXT,
        birth_date: DataTypes.DATEONLY,
        gender: DataTypes.STRING,
        religion: DataTypes.INTEGER,
        previous_school: DataTypes.INTEGER,
        nisn: DataTypes.STRING,
        nik: DataTypes.STRING,
        child_order: DataTypes.INTEGER,
        number_of_siblings: DataTypes.INTEGER,
        province: DataTypes.INTEGER,
        city: DataTypes.INTEGER,
        district: DataTypes.INTEGER,
        sub_district: DataTypes.INTEGER,
        hamlet: DataTypes.INTEGER,
        postal_code: DataTypes.INTEGER,
        rt: DataTypes.INTEGER,
        rw: DataTypes.INTEGER,
        street: DataTypes.TEXT,
        phone_number: DataTypes.STRING,
        language: DataTypes.STRING,
        discount_amount: DataTypes.INTEGER,
        batch: DataTypes.INTEGER,
        school_name: DataTypes.STRING,
        admission_sequence: DataTypes.INTEGER,
        overall_admission_sequence: DataTypes.INTEGER,
        exam_number: DataTypes.STRING,
        registration_path: DataTypes.INTEGER,
        sub_path: DataTypes.INTEGER,
        character_trait: DataTypes.STRING,
        blood_type: DataTypes.STRING,
        disease: DataTypes.TEXT,
        past_disease: DataTypes.TEXT,
        weight: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
        payment_status: DataTypes.INTEGER,
        payment_proof: DataTypes.STRING,
        re_registration_status: DataTypes.INTEGER,
        student_status: DataTypes.ENUM('siswa', 'calon'),
        selection_status: DataTypes.INTEGER,
        admission_status: DataTypes.INTEGER,
        generate_status: DataTypes.INTEGER,
        complete_biodata: DataTypes.JSON
    }, {
        sequelize,
        modelName: 'Student',
        tableName: 'student',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Student;
};
