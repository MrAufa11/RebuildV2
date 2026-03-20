'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Seed initial dummy data as requested
        // Structure based on current frontend: Beranda, Profil, Artikel, Galeri, PPDB

        // Parent Items
        const navbars = [
            { id: 1, label: 'Beranda', url: '/', order: 1, parent_id: null, createdAt: now, updatedAt: now },
            { id: 2, label: 'Profil', url: '#', order: 2, parent_id: null, createdAt: now, updatedAt: now },
            { id: 3, label: 'Artikel', url: '/news', order: 3, parent_id: null, createdAt: now, updatedAt: now },
            { id: 4, label: 'Galeri', url: '/galleries', order: 4, parent_id: null, createdAt: now, updatedAt: now },
            { id: 5, label: 'Staff & Guru', url: '/staff-guru', order: 5, parent_id: null, createdAt: now, updatedAt: now },
        ];

        // Sub-items for Profil (based on sections often used or requested structure sub-sub)
        const subNavbars = [
            { id: 6, label: 'Sambutan Kepala Sekolah', url: '/#sambutan', order: 1, parent_id: 2, createdAt: now, updatedAt: now },
            { id: 7, label: 'Sejarah', url: '/page/sejarah', order: 2, parent_id: 2, createdAt: now, updatedAt: now },
            { id: 8, label: 'Visi & Misi', url: '/page/visi-misi', order: 3, parent_id: 2, createdAt: now, updatedAt: now },
        ];

        // Sub-items for Artikel (if any, just example)
        const subArticles = [
            { id: 9, label: 'Berita Sekolah', url: '/news?category=school', order: 1, parent_id: 3, createdAt: now, updatedAt: now },
            { id: 10, label: 'Prestasi', url: '/news?category=achievement', order: 2, parent_id: 3, createdAt: now, updatedAt: now },
        ];

        await queryInterface.bulkInsert('Navbars', [...navbars, ...subNavbars, ...subArticles], {});

        // Reset auto_increment to avoid collision
        await queryInterface.sequelize.query("SELECT setval(pg_get_serial_sequence('\"Navbars\"', 'id'), coalesce(max(id)+1, 1), false) FROM \"Navbars\";").catch(err => {
            // Fallback for non-postgres if needed, but project seems postgres-friendly
            console.log("Not using Postgres or sequence reset failed, skipping...");
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Navbars', null, {});
    }
};
