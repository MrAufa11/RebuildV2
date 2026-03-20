'use strict';
const { faker } = require('@faker-js/faker');
const { databases } = require('../models');
const spmbDb = databases.spmb;
const { QueryTypes } = require('sequelize');

module.exports = {
    async up(queryInterface, Sequelize) {
        const educationLevels = ['10', '11', '7'];
        const batches = ['Gelombang 1', 'Gelombang 2', 'Gelombang 3'];

        const generateRows = (count, generatorFunc) => Array.from({ length: count }, generatorFunc);

        const executeInsert = async (table, data) => {
            if (!data || data.length === 0) return;
            const columns = Object.keys(data[0]);

            await spmbDb.query(`DELETE FROM ${table}`, { type: QueryTypes.DELETE });

            for (const row of data) {
                const values = columns.map(col => row[col]);
                const placeholders = columns.map(() => '?').join(', ');
                const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
                try {
                    await spmbDb.query(query, { replacements: values, type: QueryTypes.INSERT });
                } catch (e) {
                    console.error(`Error inserting into ${table}:`, e.message);
                }
            }
        };

        // 1. Data defining paths and their sub-paths
        const pathData = [
            { id: 1, path_name: 'Reguler' },
            { id: 2, path_name: 'Prestasi' },
            { id: 3, path_name: 'Beasiswa' }
        ];

        const subPathData = [
            { id: 1, registration_path_id: 1, sub_path_name: 'Reguler Pagi' },
            { id: 2, registration_path_id: 1, sub_path_name: 'Reguler Sore' },
            { id: 3, registration_path_id: 2, sub_path_name: 'Tahfidz Qur\'an' },
            { id: 4, registration_path_id: 2, sub_path_name: 'Juara Lomba Akademik' },
            { id: 5, registration_path_id: 2, sub_path_name: 'Juara Olahraga/Seni' },
            { id: 6, registration_path_id: 3, sub_path_name: 'Yatim Piatu' },
            { id: 7, registration_path_id: 3, sub_path_name: 'Keluarga Kurang Mampu' }
        ];

        const dataMap = {
            religion: [
                { religion_name: 'Islam' },
                { religion_name: 'Kristen' },
                { religion_name: 'Katolik' },
                { religion_name: 'Hindu' },
                { religion_name: 'Buddha' }
            ],
            bank: [
                { bank_name: 'BCA', account_number: '8321352100', recipient_name: 'Yayasan Al-Mawahib', status: 1 },
                { bank_name: 'BSI', account_number: '7123456789', recipient_name: 'PP Al-Mawahib', status: 1 }
            ],
            registration_batch: Array.from({ length: 9 }, (_, i) => ({
                id: i + 1,
                batch_code: 'B-' + (i + 1),
                batch_name: batches[i % 3],
                academic_year: '2025/2026',
                education_level: educationLevels[Math.floor(i / 3)],
                start_date: '2024-01-01',
                end_date: '2026-12-31',
                registration_path: 'Reguler',
                selection_type: 1,
                selection_date: '2026-03-01',
                selection_end_date: '2026-03-05',
                selection_result_date: '2026-03-10',
                re_registration_date: '2026-03-11',
                re_registration_end_date: '2026-03-20'
            })),
            registration_path: pathData,
            registration_sub_path: subPathData,
            academic_year_setup: [
                { year: '2025/2026', name: 'Tahun Ajaran 2025/2026', batch_generation: '35', active_status: 1 }
            ],
            life_status: [
                { status_name: 'Hidup' },
                { status_name: 'Meninggal' },
                { status_name: 'Bercerai' }
            ],
            education_level: [
                { level_name: 'SMA', abbreviation: '10', quota: 100 },
                { level_name: 'SMP', abbreviation: '7', quota: 100 },
                { level_name: 'SMK', abbreviation: '10', quota: 100 }
            ],
            income: [
                { label: '< Rp 1 Juta' },
                { label: 'Rp 1 Juta - Rp 3 Juta' },
                { label: 'Rp 3 Juta - Rp 5 Juta' },
                { label: '> Rp 5 Juta' }
            ],
            occupation: [
                { occupation_name: 'PNS', status: 1 },
                { occupation_name: 'Karyawan Swasta', status: 1 },
                { occupation_name: 'Wiraswasta', status: 1 },
                { occupation_name: 'Petani', status: 1 },
                { occupation_name: 'Guru', status: 1 }
            ]
        };

        for (const [table, rows] of Object.entries(dataMap)) {
            console.log(`Seeding SPMB table: ${table}...`);
            await executeInsert(table, rows);
        }

        const otherTables = {
            building_setup: generateRows(5, () => ({ building_code: 'G-' + faker.string.alpha(1).toUpperCase(), building_name: 'Gedung ' + faker.person.firstName() })),
            room_setup: generateRows(10, () => ({ building_name: 'Gedung A', room_code: 'R-' + faker.string.numeric(3), room_name: 'Ruang ' + faker.string.numeric(3), room_capacity: '40', room_sequence: 1 })),
            classroom: generateRows(10, () => ({ class_name: 'X-' + faker.string.alpha(1).toUpperCase(), education_level: '10' })),
            voucher: generateRows(5, () => ({ voucher_code: 'PROMO' + faker.string.numeric(3), discount_amount: '50000', status: 1 }))
        };

        for (const [table, rows] of Object.entries(otherTables)) {
            await executeInsert(table, rows);
        }

        console.log('SPMB Master Dummy Data inserted successfully.');
    },

    async down(queryInterface, Sequelize) {
        // Safe down
    }
};
