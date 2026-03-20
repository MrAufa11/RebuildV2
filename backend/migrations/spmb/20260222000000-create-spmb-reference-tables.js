'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. religion
        await queryInterface.createTable('religion', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            religion_name: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 2. bank
        await queryInterface.createTable('bank', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            bank_name: { type: Sequelize.STRING(225), allowNull: false },
            account_number: { type: Sequelize.STRING(20), allowNull: false },
            recipient_name: { type: Sequelize.STRING(225), allowNull: false },
            status: { type: Sequelize.TINYINT, allowNull: false }
        }, { charset: 'latin1' });

        // 3. schedule_detail
        await queryInterface.createTable('schedule_detail', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            room: { type: Sequelize.STRING(128), allowNull: false },
            capacity: { type: Sequelize.STRING(128), allowNull: false }
        }, { charset: 'latin1' });

        // 4. discount
        await queryInterface.createTable('discount', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            discount_name: { type: Sequelize.STRING(225), allowNull: false },
            discount_type: { type: Sequelize.STRING(100), allowNull: false },
            amount: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 5. format
        await queryInterface.createTable('format', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            code: { type: Sequelize.STRING(125), allowNull: false },
            table_name: { type: Sequelize.STRING(125), allowNull: false },
            field: { type: Sequelize.STRING(125), allowNull: false },
            relation: { type: Sequelize.STRING(100), allowNull: false },
            code_digit: { type: Sequelize.STRING(125), allowNull: false },
            source: { type: Sequelize.STRING(225), allowNull: false },
            hardcode_content: { type: Sequelize.STRING(225), allowNull: false }
        }, { charset: 'latin1' });

        // 6. registration_batch
        await queryInterface.createTable('registration_batch', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            batch_code: { type: Sequelize.STRING(52), allowNull: true },
            batch_name: { type: Sequelize.STRING(255), allowNull: false },
            academic_year: { type: Sequelize.STRING(11), allowNull: false },
            education_level: { type: Sequelize.STRING(100), allowNull: false },
            start_date: { type: Sequelize.DATEONLY, allowNull: false },
            end_date: { type: Sequelize.DATEONLY, allowNull: false },
            registration_path: { type: Sequelize.STRING(255), allowNull: true },
            selection_type: { type: Sequelize.INTEGER, allowNull: false },
            selection_date: { type: Sequelize.DATEONLY, allowNull: true },
            selection_end_date: { type: Sequelize.DATEONLY, allowNull: true },
            selection_result_date: { type: Sequelize.DATEONLY, allowNull: true },
            re_registration_date: { type: Sequelize.DATEONLY, allowNull: false },
            re_registration_end_date: { type: Sequelize.DATEONLY, allowNull: true }
        }, { charset: 'latin1' });

        // 7. fee
        await queryInterface.createTable('fee', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            fee_type: { type: Sequelize.STRING(255), allowNull: false },
            code: { type: Sequelize.STRING(255), allowNull: false },
            fee_name: { type: Sequelize.STRING(255), allowNull: false },
            amount: { type: Sequelize.STRING(15), allowNull: false },
            education_level: { type: Sequelize.STRING(128), allowNull: false },
            batch: { type: Sequelize.STRING(128), allowNull: false },
            path: { type: Sequelize.STRING(128), allowNull: false },
            sub_path: { type: Sequelize.STRING(30), allowNull: false },
            path_level: { type: Sequelize.STRING(128), allowNull: false },
            sequence: { type: Sequelize.INTEGER, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        }, { charset: 'latin1' });

        // 8. position
        await queryInterface.createTable('position', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            position_name: { type: Sequelize.STRING(128), allowNull: false }
        }, { charset: 'latin1' });

        // 9. selection_schedule
        await queryInterface.createTable('selection_schedule', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            schedule_code: { type: Sequelize.STRING(128), allowNull: false },
            education_level: { type: Sequelize.STRING(128), allowNull: false },
            batch: { type: Sequelize.STRING(128), allowNull: false },
            supervisor: { type: Sequelize.STRING(50), allowNull: false },
            path: { type: Sequelize.STRING(50), allowNull: false },
            selection_type: { type: Sequelize.STRING(128), allowNull: false },
            selection_date: { type: Sequelize.DATEONLY, allowNull: false },
            start_time: { type: Sequelize.TIME, allowNull: false },
            end_time: { type: Sequelize.TIME, allowNull: false },
            session: { type: Sequelize.STRING(128), allowNull: false },
            room: { type: Sequelize.STRING(225), allowNull: false },
            uniform_date: { type: Sequelize.DATEONLY, allowNull: false },
            selection_result_date: { type: Sequelize.DATEONLY, allowNull: false }
        }, { charset: 'latin1' });

        // 10. registration_path
        await queryInterface.createTable('registration_path', {
            id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
            path_name: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 11. selection_type
        await queryInterface.createTable('selection_type', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            selection_code: { type: Sequelize.STRING(255), allowNull: false },
            selection_name: { type: Sequelize.STRING(255), allowNull: false },
            education_level: { type: Sequelize.STRING(255), allowNull: false },
            selection_sequence: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 12. classroom
        await queryInterface.createTable('classroom', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            class_name: { type: Sequelize.STRING(20), allowNull: false },
            education_level: { type: Sequelize.STRING(100), allowNull: false }
        }, { charset: 'latin1' });

        // 13. exam_number
        await queryInterface.createTable('exam_number', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            format_id: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 14. occupation
        await queryInterface.createTable('occupation', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            occupation_name: { type: Sequelize.STRING(255), allowNull: false },
            status: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 15. income
        await queryInterface.createTable('income', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            label: { type: Sequelize.STRING(250), allowNull: false }
        }, { charset: 'latin1' });

        // 16. applicant_document
        await queryInterface.createTable('applicant_document', {
            email: { type: Sequelize.STRING(100), allowNull: false, primaryKey: true },
            passport_photo: { type: Sequelize.TEXT, allowNull: false },
            family_card: { type: Sequelize.TEXT, allowNull: false },
            birth_certificate: { type: Sequelize.TEXT, allowNull: false }
        }, { charset: 'latin1' });

        // 17. school_data
        await queryInterface.createTable('school_data', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            province_code: { type: Sequelize.STRING(50), allowNull: false },
            city_code: { type: Sequelize.STRING(50), allowNull: false },
            district_code: { type: Sequelize.STRING(50), allowNull: false },
            school_code: { type: Sequelize.STRING(50), allowNull: false },
            school_name: { type: Sequelize.STRING(200), allowNull: false },
            address: { type: Sequelize.STRING(200), allowNull: false },
            sub_district: { type: Sequelize.STRING(200), allowNull: false },
            status: { type: Sequelize.STRING(100), allowNull: false },
            education_level: { type: Sequelize.STRING(50), allowNull: false },
            latitude: { type: Sequelize.STRING(50), allowNull: false },
            longitude: { type: Sequelize.STRING(50), allowNull: false },
            member_id: { type: Sequelize.INTEGER, allowNull: false },
            member_status: { type: Sequelize.INTEGER, allowNull: false },
            admission_status: { type: Sequelize.INTEGER, allowNull: false, comment: '1=Open, 0=Closed' },
            logo: { type: Sequelize.STRING(200), allowNull: false },
            principal_photo: { type: Sequelize.STRING(200), allowNull: false },
            principal_name: { type: Sequelize.STRING(200), allowNull: false },
            keywords: { type: Sequelize.STRING(500), allowNull: false }
        }, { charset: 'latin1' });

        // 18. building_setup
        await queryInterface.createTable('building_setup', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            building_code: { type: Sequelize.STRING(255), allowNull: false },
            building_name: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 19. room_setup
        await queryInterface.createTable('room_setup', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            building_name: { type: Sequelize.STRING(255), allowNull: false },
            room_code: { type: Sequelize.STRING(255), allowNull: false },
            room_name: { type: Sequelize.STRING(255), allowNull: false },
            room_capacity: { type: Sequelize.STRING(255), allowNull: false },
            room_sequence: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 20. discount_setup
        await queryInterface.createTable('discount_setup', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            fee_id: { type: Sequelize.INTEGER, allowNull: true },
            discount_id: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 21. academic_year_setup
        await queryInterface.createTable('academic_year_setup', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            year: { type: Sequelize.STRING(20), allowNull: false },
            name: { type: Sequelize.STRING(125), allowNull: false },
            batch_generation: { type: Sequelize.STRING(125), allowNull: false },
            active_status: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 22. life_status
        await queryInterface.createTable('life_status', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            status_name: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 23. registration_sub_path
        await queryInterface.createTable('registration_sub_path', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            registration_path_id: { type: Sequelize.INTEGER, allowNull: false },
            sub_path_name: { type: Sequelize.STRING(255), allowNull: false }
        }, { charset: 'latin1' });

        // 24. requirement_master
        await queryInterface.createTable('requirement_master', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            requirement_name: { type: Sequelize.STRING(125), allowNull: false },
            education_level: { type: Sequelize.STRING(125), allowNull: false },
            code: { type: Sequelize.STRING(125), allowNull: false },
            registration_path: { type: Sequelize.STRING(30), allowNull: false },
            status: { type: Sequelize.ENUM('Wajib', 'Optional', ''), allowNull: false }
        }, { charset: 'latin1' });

        // 25. education_level
        await queryInterface.createTable('education_level', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            level_name: { type: Sequelize.STRING(100), allowNull: false },
            abbreviation: { type: Sequelize.STRING(11), allowNull: false },
            quota: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });

        // 26. uploaded_requirement
        await queryInterface.createTable('uploaded_requirement', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            code: { type: Sequelize.STRING(100), allowNull: false },
            file_path: { type: Sequelize.STRING(100), allowNull: false }
        }, { charset: 'latin1' });

        // 27. voucher
        await queryInterface.createTable('voucher', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            voucher_code: { type: Sequelize.STRING(50), allowNull: false },
            discount_amount: { type: Sequelize.STRING(10), allowNull: false },
            status: { type: Sequelize.INTEGER, allowNull: false }
        }, { charset: 'latin1' });
    },

    down: async (queryInterface, Sequelize) => {
        const tables = [
            'voucher', 'uploaded_requirement', 'education_level', 'requirement_master',
            'registration_sub_path', 'life_status', 'academic_year_setup', 'discount_setup',
            'room_setup', 'building_setup', 'school_data', 'applicant_document',
            'income', 'occupation', 'exam_number', 'classroom', 'selection_type',
            'registration_path', 'selection_schedule', 'position', 'fee',
            'registration_batch', 'format', 'discount', 'schedule_detail',
            'bank', 'religion'
        ];

        for (const table of tables) {
            await queryInterface.dropTable(table);
        }
    }
};
