'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Seed Banners
        await queryInterface.bulkDelete('Banners', null, {});
        await queryInterface.bulkInsert('Banners', [
            {
                title: 'Selamat Datang di Al-Mawahib',
                subtitle: 'Membangun Generasi Rabbani',
                image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
                order: 1,
                is_active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                title: 'Pendaftaran Siswa Baru',
                subtitle: 'Tahun Ajaran 2026/2027',
                image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
                order: 2,
                is_active: true,
                createdAt: now,
                updatedAt: now
            }
        ]);

        // 2. Seed Categories
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkInsert('Categories', [
            { id: 1, name: 'Berita Sekolah', slug: 'berita-sekolah', createdAt: now, updatedAt: now },
            { id: 2, name: 'Prestasi', slug: 'prestasi', createdAt: now, updatedAt: now },
            { id: 3, name: 'Kegiatan', slug: 'kegiatan', createdAt: now, updatedAt: now }
        ]);

        // 3. Seed Articles
        await queryInterface.bulkDelete('Articles', null, {});
        const articles = [];
        for (let i = 1; i <= 6; i++) {
            articles.push({
                title: `Kegiatan Belajar Mengajar ${i}`,
                slug: `kegiatan-belajar-mengajar-${i}`,
                content: `<p>Ini adalah konten dummy untuk artikel nomor ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
                excerpt: `Ringkasan kegiatan belajar mengajar yang kondusif di Al-Mawahib part ${i}.`,
                image_url: `https://source.unsplash.com/random/800x600?education,school&sig=${i}`,
                category_id: (i % 3) + 1,
                author_id: 1, // Assumes user ID 1 exists (admin)
                published_at: now,
                is_published: true,
                createdAt: now,
                updatedAt: now
            });
        }
        await queryInterface.bulkInsert('Articles', articles);

        // 4. Seed Teachers
        await queryInterface.bulkDelete('Teachers', null, {});
        const teachers = [
            { name: 'Drs. H. Ahmad Fauzi', position: 'Kepala Madrasah', nip: '198001012005011001', bio: 'Kepala Madrasah berpengalaman.', image_url: 'https://randomuser.me/api/portraits/men/32.jpg', createdAt: now, updatedAt: now },
            { name: 'Siti Aminah, S.Pd', position: 'Waka Kurikulum', nip: '198502022008012002', bio: 'Ahli kurikulum pendidikan Islam.', image_url: 'https://randomuser.me/api/portraits/women/44.jpg', createdAt: now, updatedAt: now },
            { name: 'Budi Santoso, M.Pd', position: 'Guru Matematika', nip: '199003032010011003', bio: 'Guru matematika menyenangkan.', image_url: 'https://randomuser.me/api/portraits/men/45.jpg', createdAt: now, updatedAt: now },
            { name: 'Rina Wati, S.Ag', position: 'Guru Bahasa Arab', nip: '199204042015012004', bio: 'Pakar bahasa Arab.', image_url: 'https://randomuser.me/api/portraits/women/68.jpg', createdAt: now, updatedAt: now }
        ];
        await queryInterface.bulkInsert('Teachers', teachers);

        // 5. Seed Galleries
        await queryInterface.bulkDelete('Galleries', null, {});
        const galleries = [];
        for (let i = 1; i <= 8; i++) {
            galleries.push({
                title: `Dokumentasi Kegiatan ${i}`,
                description: `Foto dokumentasi kegiatan seru di sekolah nomor ${i}`,
                image_url: `https://source.unsplash.com/random/800x600?student,school&sig=${i + 10}`,
                category: 'Kegiatan',
                createdAt: now,
                updatedAt: now
            });
        }
        await queryInterface.bulkInsert('Galleries', galleries);

        // 6. Seed Settings (Welcome Section)
        const settings = [
            { key: 'welcome_title', value: 'Membangun Fondasi <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500">Karakter Qur\'ani</span> di Era Digital' },
            { key: 'welcome_message', value: 'Selamat datang di MA Bina Insan Mulia Al-Mawahib. Kami percaya bahwa kecerdasan intelektual harus berjalan beriringan dengan kematangan spiritual. Kurikulum kami dirancang untuk menjawab tantangan zaman tanpa mencabut akar tradisi keislaman.' },
            { key: 'welcome_image', value: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80' },
            { key: 'principal_name', value: 'Drs. H. Ahmad Fauzi' },
            { key: 'principal_image', value: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { key: 'principal_quote', value: '"Pendidikan adalah senjata paling mematikan untuk mengubah dunia."' }
        ];

        for (const s of settings) {
            // Upsert logic for SQLite/MySQL in seeder is tricky, easier to delete or check exist. 
            // For simplicity in bulk seed, we ignore duplicates or rely on App logic.
            // Let's use INSERT IGNORE logic if possible or just try insert.
            // Sequelize bulkInsert doesn't support updateOnDuplicate well across all dialects in raw query easily.
            // We act safe: Check if exists
            const [exists] = await queryInterface.sequelize.query(`SELECT id FROM Settings WHERE \`key\`='${s.key}' LIMIT 1`);
            if (exists.length === 0) {
                await queryInterface.bulkInsert('Settings', [{
                    key: s.key,
                    value: s.value,
                    type: 'text',
                    group: 'welcome',
                    createdAt: now,
                    updatedAt: now
                }]);
            }
        }

        // 7. Seed Public Navbars
        await queryInterface.bulkDelete('Navbars', null, {});

        // Parent Items
        await queryInterface.bulkInsert('Navbars', [
            { id: 1, label: 'Beranda', url: '/', icon: null, parent_id: null, order: 1, createdAt: now, updatedAt: now },
            { id: 2, label: 'Profil', url: '#', icon: null, parent_id: null, order: 2, createdAt: now, updatedAt: now },
            { id: 3, label: 'Akademik', url: '#', icon: null, parent_id: null, order: 3, createdAt: now, updatedAt: now },
            { id: 4, label: 'Kesiswaan', url: '#', icon: null, parent_id: null, order: 4, createdAt: now, updatedAt: now },
            { id: 5, label: 'Galeri', url: '/galeri', icon: null, parent_id: null, order: 5, createdAt: now, updatedAt: now },
            { id: 6, label: 'Berita', url: '/news', icon: null, parent_id: null, order: 6, createdAt: now, updatedAt: now },
            { id: 7, label: 'Kontak', url: '/contact', icon: null, parent_id: null, order: 7, createdAt: now, updatedAt: now }
        ]);

        // Sub Items (Profil)
        await queryInterface.bulkInsert('Navbars', [
            { label: 'Sambutan Kepala', url: '/about/welcome', icon: null, parent_id: 2, order: 1, createdAt: now, updatedAt: now },
            { label: 'Visi & Misi', url: '/about/vision', icon: null, parent_id: 2, order: 2, createdAt: now, updatedAt: now },
            { label: 'Sejarah', url: '/about/history', icon: null, parent_id: 2, order: 3, createdAt: now, updatedAt: now },
            { label: 'Guru & Staff', url: '/teachers', icon: null, parent_id: 2, order: 4, createdAt: now, updatedAt: now }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Banners', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Articles', null, {});
        await queryInterface.bulkDelete('Teachers', null, {});
        await queryInterface.bulkDelete('Galleries', null, {});
        await queryInterface.bulkDelete('Navbars', null, {});
        // Be careful deleting settings
    }
};
