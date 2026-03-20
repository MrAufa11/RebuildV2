'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. re_registration_payment
        await queryInterface.createTable('re_registration_payment', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            student_id: { type: Sequelize.INTEGER, allowNull: false },
            amount: { type: Sequelize.INTEGER, allowNull: false },
            payment_date: { type: Sequelize.DATEONLY, allowNull: true },
            payment_proof: { type: Sequelize.TEXT, allowNull: false },
            paid_by_user_id: { type: Sequelize.INTEGER, allowNull: false },
            payment_status: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 2. re_registration_fee
        await queryInterface.createTable('re_registration_fee', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            fee_id: { type: Sequelize.INTEGER, allowNull: false },
            fee_name: { type: Sequelize.STRING(50), allowNull: false },
            amount: { type: Sequelize.STRING(20), allowNull: false },
            batch: { type: Sequelize.STRING(51), allowNull: false },
            registration_path: { type: Sequelize.INTEGER, allowNull: false },
            discount_id: { type: Sequelize.INTEGER, allowNull: false },
            discount_amount: { type: Sequelize.INTEGER, allowNull: false },
            total_amount: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 3. re_registration_fee_per_student
        await queryInterface.createTable('re_registration_fee_per_student', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            fee_name: { type: Sequelize.STRING(50), allowNull: false },
            amount: { type: Sequelize.STRING(20), allowNull: false },
            batch: { type: Sequelize.STRING(51), allowNull: false }
        }, { charset: 'latin1' });

        // 4. prospective_student
        await queryInterface.createTable('prospective_student', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            full_name: { type: Sequelize.STRING(100), allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false },
            batch: { type: Sequelize.STRING(30), allowNull: false },
            registration_year: { type: Sequelize.INTEGER, allowNull: false },
            grade_level: { type: Sequelize.INTEGER, allowNull: false },
            registration_path: { type: Sequelize.STRING(20), allowNull: false },
            sub_path: { type: Sequelize.STRING(50), allowNull: false },
            birth_place: { type: Sequelize.STRING(100), allowNull: false },
            birth_date: { type: Sequelize.DATEONLY, allowNull: false },
            gender: { type: Sequelize.STRING(20), allowNull: false },
            religion: { type: Sequelize.STRING(30), allowNull: false },
            previous_school: { type: Sequelize.STRING(100), allowNull: false },
            father_name: { type: Sequelize.STRING(100), allowNull: false },
            mother_name: { type: Sequelize.STRING(100), allowNull: false },
            nisn: { type: Sequelize.STRING(20), allowNull: false },
            birth_certificate_number: { type: Sequelize.STRING(20), allowNull: false },
            child_order: { type: Sequelize.STRING(10), allowNull: false },
            number_of_siblings: { type: Sequelize.STRING(10), allowNull: false },
            province: { type: Sequelize.STRING(100), allowNull: false },
            city: { type: Sequelize.STRING(100), allowNull: false },
            district: { type: Sequelize.STRING(100), allowNull: false },
            sub_district: { type: Sequelize.STRING(100), allowNull: false },
            hamlet: { type: Sequelize.STRING(100), allowNull: false },
            postal_code: { type: Sequelize.STRING(10), allowNull: false },
            rt: { type: Sequelize.STRING(10), allowNull: false },
            rw: { type: Sequelize.STRING(10), allowNull: false },
            street: { type: Sequelize.TEXT, allowNull: false },
            language: { type: Sequelize.STRING(30), allowNull: false }
        }, { charset: 'latin1' });

        // 5. parent_data
        await queryInterface.createTable('parent_data', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false },
            father_nik: { type: Sequelize.STRING(20), allowNull: false },
            father_name: { type: Sequelize.STRING(100), allowNull: false },
            father_birth_place: { type: Sequelize.STRING(100), allowNull: false },
            father_birth_date: { type: Sequelize.DATEONLY, allowNull: false },
            father_religion: { type: Sequelize.STRING(30), allowNull: false },
            father_status: { type: Sequelize.STRING(20), allowNull: false },
            father_education: { type: Sequelize.STRING(30), allowNull: false },
            father_major: { type: Sequelize.STRING(30), allowNull: false },
            father_school: { type: Sequelize.STRING(50), allowNull: false },
            father_occupation: { type: Sequelize.STRING(50), allowNull: false },
            father_income: { type: Sequelize.STRING(100), allowNull: false },
            father_institution: { type: Sequelize.STRING(50), allowNull: false },
            father_position: { type: Sequelize.STRING(50), allowNull: false },
            father_province: { type: Sequelize.STRING(50), allowNull: false },
            father_city: { type: Sequelize.STRING(50), allowNull: false },
            father_district: { type: Sequelize.STRING(50), allowNull: false },
            father_sub_district: { type: Sequelize.STRING(50), allowNull: false },
            father_hamlet: { type: Sequelize.STRING(50), allowNull: false },
            father_postal_code: { type: Sequelize.STRING(20), allowNull: false },
            father_rt: { type: Sequelize.STRING(10), allowNull: false },
            father_rw: { type: Sequelize.STRING(10), allowNull: false },
            father_street: { type: Sequelize.TEXT, allowNull: false },
            father_phone_number: { type: Sequelize.TEXT, allowNull: false },
            father_email: { type: Sequelize.STRING(100), allowNull: false },
            father_instagram: { type: Sequelize.STRING(100), allowNull: false },
            father_facebook: { type: Sequelize.STRING(100), allowNull: false },
            mother_nik: { type: Sequelize.STRING(20), allowNull: false },
            mother_name: { type: Sequelize.STRING(100), allowNull: false },
            mother_birth_place: { type: Sequelize.STRING(100), allowNull: false },
            mother_birth_date: { type: Sequelize.DATEONLY, allowNull: false },
            mother_religion: { type: Sequelize.STRING(30), allowNull: false },
            mother_status: { type: Sequelize.STRING(30), allowNull: false },
            mother_education: { type: Sequelize.STRING(30), allowNull: false },
            mother_major: { type: Sequelize.STRING(30), allowNull: false },
            mother_school: { type: Sequelize.STRING(30), allowNull: false },
            mother_occupation: { type: Sequelize.STRING(30), allowNull: false },
            mother_income: { type: Sequelize.STRING(30), allowNull: false },
            mother_institution: { type: Sequelize.STRING(30), allowNull: false },
            mother_position: { type: Sequelize.STRING(30), allowNull: false },
            mother_province: { type: Sequelize.STRING(30), allowNull: false },
            mother_city: { type: Sequelize.STRING(30), allowNull: false },
            mother_district: { type: Sequelize.STRING(30), allowNull: false },
            mother_sub_district: { type: Sequelize.STRING(30), allowNull: false },
            mother_hamlet: { type: Sequelize.STRING(30), allowNull: false },
            mother_postal_code: { type: Sequelize.STRING(30), allowNull: false },
            mother_rt: { type: Sequelize.STRING(10), allowNull: false },
            mother_rw: { type: Sequelize.STRING(10), allowNull: false },
            mother_street: { type: Sequelize.TEXT, allowNull: false },
            mother_phone_number: { type: Sequelize.STRING(20), allowNull: false },
            mother_email: { type: Sequelize.STRING(100), allowNull: false },
            mother_instagram: { type: Sequelize.STRING(100), allowNull: false },
            mother_facebook: { type: Sequelize.STRING(100), allowNull: false }
        }, { charset: 'latin1' });

        // 6. re_registration_information
        await queryInterface.createTable('re_registration_information', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            document: { type: Sequelize.TEXT, allowNull: false }
        }, { charset: 'latin1' });

        // 7. location
        await queryInterface.createTable('location', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            address: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 8. registration
        await queryInterface.createTable('registration', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false },
            phone_number: { type: Sequelize.STRING(100), allowNull: true },
            full_name: { type: Sequelize.STRING(100), allowNull: false },
            school_name: { type: Sequelize.STRING(100), allowNull: true, defaultValue: 'Ma Almawahib' },
            batch: { type: Sequelize.STRING(30), allowNull: true },
            admission_sequence: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
            overall_admission_sequence: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
            exam_number: { type: Sequelize.STRING(225), allowNull: true, defaultValue: '0' },
            registration_year: { type: Sequelize.INTEGER, allowNull: true },
            grade_level: { type: Sequelize.INTEGER, allowNull: true },
            registration_path: { type: Sequelize.STRING(20), allowNull: true },
            sub_path: { type: Sequelize.STRING(50), allowNull: true },
            birth_place: { type: Sequelize.STRING(100), allowNull: true },
            birth_date: { type: Sequelize.DATEONLY, allowNull: true },
            gender: { type: Sequelize.STRING(20), allowNull: true },
            religion: { type: Sequelize.STRING(30), allowNull: true },
            previous_school: { type: Sequelize.STRING(255), allowNull: true },
            father_name: { type: Sequelize.STRING(100), allowNull: true },
            mother_name: { type: Sequelize.STRING(100), allowNull: true },
            payment_status: { type: Sequelize.STRING(20), allowNull: true, defaultValue: '0' },
            payment_proof: { type: Sequelize.TEXT, allowNull: true },
            nisn: { type: Sequelize.STRING(20), allowNull: true },
            birth_certificate_number: { type: Sequelize.STRING(20), allowNull: true },
            child_order: { type: Sequelize.STRING(10), allowNull: true },
            number_of_siblings: { type: Sequelize.STRING(10), allowNull: true },
            province: { type: Sequelize.STRING(100), allowNull: true },
            re_registration_status: { type: Sequelize.INTEGER, allowNull: true },
            selection_result: { type: Sequelize.INTEGER, allowNull: true },
            city: { type: Sequelize.STRING(100), allowNull: true },
            district: { type: Sequelize.STRING(100), allowNull: true },
            sub_district: { type: Sequelize.STRING(100), allowNull: true },
            parent_whatsapp_number: { type: Sequelize.STRING(100), allowNull: true },
            address: { type: Sequelize.TEXT, allowNull: true },
            village: { type: Sequelize.TEXT, allowNull: true },
            hamlet: { type: Sequelize.STRING(100), allowNull: true },
            postal_code: { type: Sequelize.STRING(10), allowNull: true },
            rt: { type: Sequelize.STRING(10), allowNull: true },
            rw: { type: Sequelize.STRING(10), allowNull: true },
            street: { type: Sequelize.TEXT, allowNull: true },
            language: { type: Sequelize.STRING(30), allowNull: true },
            admission_status: { type: Sequelize.STRING(20), allowNull: true, defaultValue: '0' },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        }, { charset: 'latin1' });

        // 9. education 
        await queryInterface.createTable('education', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            education_name: { type: Sequelize.STRING(255), allowNull: false },
            status: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 10. student_participant
        await queryInterface.createTable('student_participant', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            full_name: { type: Sequelize.STRING(100), allowNull: false },
            sequence_number: { type: Sequelize.STRING(5), allowNull: false },
            nism: { type: Sequelize.STRING(20), allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false },
            registration_year: { type: Sequelize.INTEGER, allowNull: false },
            grade_level: { type: Sequelize.INTEGER, allowNull: false },
            birth_place: { type: Sequelize.STRING(100), allowNull: false },
            birth_date: { type: Sequelize.DATEONLY, allowNull: false },
            gender: { type: Sequelize.STRING(20), allowNull: false },
            religion: { type: Sequelize.STRING(30), allowNull: false },
            previous_school: { type: Sequelize.STRING(100), allowNull: false },
            father_name: { type: Sequelize.STRING(100), allowNull: false },
            mother_name: { type: Sequelize.STRING(100), allowNull: false },
            nisn: { type: Sequelize.STRING(20), allowNull: true },
            birth_certificate_number: { type: Sequelize.STRING(20), allowNull: true },
            child_order: { type: Sequelize.STRING(10), allowNull: true },
            number_of_siblings: { type: Sequelize.STRING(10), allowNull: true },
            province: { type: Sequelize.STRING(100), allowNull: true },
            city: { type: Sequelize.STRING(100), allowNull: true },
            district: { type: Sequelize.STRING(100), allowNull: true },
            sub_district: { type: Sequelize.STRING(100), allowNull: true },
            hamlet: { type: Sequelize.STRING(100), allowNull: true },
            postal_code: { type: Sequelize.STRING(100), allowNull: true },
            rt: { type: Sequelize.STRING(100), allowNull: true },
            rw: { type: Sequelize.STRING(100), allowNull: true },
            street: { type: Sequelize.STRING(30), allowNull: true },
            phone_number: { type: Sequelize.STRING(20), allowNull: true },
            language: { type: Sequelize.STRING(30), allowNull: true },
            discount_amount: { type: Sequelize.INTEGER, allowNull: true }
        }, { charset: 'latin1' });

        // 11. health_history
        await queryInterface.createTable('health_history', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false },
            character_trait: { type: Sequelize.STRING(40), allowNull: false },
            blood_type: { type: Sequelize.STRING(10), allowNull: false },
            abnormality: { type: Sequelize.STRING(100), allowNull: false },
            birthmark: { type: Sequelize.STRING(100), allowNull: false },
            disease: { type: Sequelize.STRING(100), allowNull: false },
            past_disease: { type: Sequelize.STRING(100), allowNull: false },
            weight: { type: Sequelize.STRING(5), allowNull: false },
            height: { type: Sequelize.STRING(10), allowNull: false }
        }, { charset: 'latin1' });

        // 12. student
        await queryInterface.createTable('student', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            registration_id: { type: Sequelize.INTEGER, allowNull: false },
            email: { type: Sequelize.STRING(255), allowNull: true },
            full_name: { type: Sequelize.STRING(255), allowNull: true },
            sequence_number: { type: Sequelize.INTEGER, allowNull: true },
            nism: { type: Sequelize.STRING(17), allowNull: true },
            nis: { type: Sequelize.STRING(20), allowNull: true },
            registration_year: { type: Sequelize.INTEGER, allowNull: true },
            grade_level: { type: Sequelize.INTEGER, allowNull: true },
            birth_place: { type: Sequelize.TEXT, allowNull: true },
            birth_date: { type: Sequelize.DATEONLY, allowNull: true },
            gender: { type: Sequelize.STRING(10), allowNull: true },
            religion: { type: Sequelize.INTEGER, allowNull: true },
            previous_school: { type: Sequelize.INTEGER, allowNull: true },
            nisn: { type: Sequelize.STRING(18), allowNull: true },
            nik: { type: Sequelize.STRING(17), allowNull: true },
            child_order: { type: Sequelize.INTEGER, allowNull: true },
            number_of_siblings: { type: Sequelize.INTEGER, allowNull: true },
            province: { type: Sequelize.INTEGER, allowNull: true },
            city: { type: Sequelize.INTEGER, allowNull: true },
            district: { type: Sequelize.INTEGER, allowNull: true },
            sub_district: { type: Sequelize.INTEGER, allowNull: true },
            hamlet: { type: Sequelize.INTEGER, allowNull: true },
            postal_code: { type: Sequelize.INTEGER, allowNull: true },
            rt: { type: Sequelize.INTEGER, allowNull: true },
            rw: { type: Sequelize.INTEGER, allowNull: true },
            street: { type: Sequelize.TEXT, allowNull: true },
            phone_number: { type: Sequelize.STRING(18), allowNull: true },
            language: { type: Sequelize.STRING(100), allowNull: true },
            discount_amount: { type: Sequelize.INTEGER, allowNull: true },
            batch: { type: Sequelize.INTEGER, allowNull: true },
            school_name: { type: Sequelize.STRING(100), allowNull: true },
            admission_sequence: { type: Sequelize.INTEGER, allowNull: true },
            overall_admission_sequence: { type: Sequelize.INTEGER, allowNull: true },
            exam_number: { type: Sequelize.STRING(50), allowNull: true },
            registration_path: { type: Sequelize.INTEGER, allowNull: true },
            sub_path: { type: Sequelize.INTEGER, allowNull: true },
            character_trait: { type: Sequelize.STRING(255), allowNull: true },
            blood_type: { type: Sequelize.STRING(255), allowNull: true },
            disease: { type: Sequelize.TEXT, allowNull: true },
            past_disease: { type: Sequelize.TEXT, allowNull: true },
            weight: { type: Sequelize.INTEGER, allowNull: true },
            height: { type: Sequelize.INTEGER, allowNull: true },
            payment_status: { type: Sequelize.INTEGER, allowNull: true },
            payment_proof: { type: Sequelize.STRING(255), allowNull: true },
            re_registration_status: { type: Sequelize.INTEGER, allowNull: true },
            student_status: { type: Sequelize.ENUM('siswa', 'calon'), allowNull: true },
            selection_status: { type: Sequelize.INTEGER, allowNull: true },
            admission_status: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
            generate_status: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        }, { charset: 'latin1' });

        // 13. transaction
        await queryInterface.createTable('transaction', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            voucher_id: { type: Sequelize.INTEGER, allowNull: true },
            bill_id: { type: Sequelize.INTEGER, allowNull: false },
            bill_amount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            discount_amount: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            payment_status: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            paid_amount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            installment: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
        }, { charset: 'latin1' });
    },

    down: async (queryInterface, Sequelize) => {
        const tables = [
            'transaction', 'student', 'health_history', 'student_participant',
            'education', 'registration', 'location', 're_registration_information',
            'parent_data', 'prospective_student', 're_registration_fee_per_student',
            're_registration_fee', 're_registration_payment'
        ];
        for (const table of tables) {
            await queryInterface.dropTable(table);
        }
    }
};
