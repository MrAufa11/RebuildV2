const db = require('../models');

async function seedWebsiteData() {
    try {
        console.log('🌱 Seeding Website Data...');

        // 1. Categories
        const categoriesData = [
            { name: 'Berita', slug: 'berita', type: 'news' },
            { name: 'Pengumuman', slug: 'pengumuman', type: 'news' },
            { name: 'Artikel Islami', slug: 'artikel-islami', type: 'article' },
            { name: 'Kegiatan', slug: 'kegiatan', type: 'gallery' },
            { name: 'Pendidikan', slug: 'pendidikan', type: 'gallery' },
            { name: 'Ekstrakurikuler', slug: 'ekstrakurikuler', type: 'gallery' },
            { name: 'Prestasi', slug: 'prestasi', type: 'gallery' }
        ];

        const categories = {};
        for (const cat of categoriesData) {
            const [record] = await db.WebsiteCategory.findOrCreate({
                where: { slug: cat.slug },
                defaults: cat
            });
            // Map by Name (lowercase) AND Slug for easy lookup
            categories[cat.slug] = record;
            categories[cat.name.toLowerCase()] = record;
        }
        console.log('✅ Categories seeded.');

        // ... Articles ...

        // 5. Galleries
        const galleriesData = [
            { title: 'Upacara Bendera', image_url: 'https://placehold.co/600x400?text=Upacara', category: 'kegiatan' },
            { title: 'Kajian Kitab Kuning', image_url: 'https://placehold.co/600x400?text=Kajian', category: 'pendidikan' },
            { title: 'Latihan Pramuka', image_url: 'https://placehold.co/600x400?text=Pramuka', category: 'ekstrakurikuler' },
            { title: 'Wisuda Santri', image_url: 'https://placehold.co/600x400?text=Wisuda', category: 'prestasi' }
        ];

        for (const gal of galleriesData) {
            const cat = categories[gal.category];
            await db.Gallery.findOrCreate({
                where: { title: gal.title },
                defaults: {
                    ...gal,
                    category_id: cat ? cat.id : null
                }
            });
        }
        console.log('✅ Galleries seeded.');

        // ... Navbars ...

        // ... Pages ...

        // 8. Settings
        const settingsData = [
            { key: 'site_title', value: 'Ponpes Al-Mawahib', type: 'text', group: 'general' },
            { key: 'site_description', value: 'Membangun Generasi Rabbani', type: 'text', group: 'general' },
            { key: 'foundation_name', value: 'Yayasan Al-Mawahib', type: 'text', group: 'general' },
            { key: 'contact_email', value: 'info@almawahib.sch.id', type: 'text', group: 'contact' },
            { key: 'contact_phone', value: '+62 812 3456 7890', type: 'text', group: 'contact' },
            { key: 'social_facebook', value: 'https://facebook.com', type: 'text', group: 'social' },
            { key: 'social_instagram', value: 'https://instagram.com', type: 'text', group: 'social' },
            { key: 'logo_url', value: '/logo.png', type: 'image', group: 'general' },
            { key: 'site_logo', value: '/logo.png', type: 'image', group: 'general' },
            { key: 'site_favicon', value: '/favicon.ico', type: 'image', group: 'general' }
        ];

        for (const setting of settingsData) {
            await db.Setting.findOrCreate({
                where: { key: setting.key },
                defaults: setting
            });
        }
        // 2. Articles
        const articlesData = [
            {
                title: 'Penerimaan Santri Baru Tahun Ajaran 2024/2025 Telah Dibuka',
                slug: 'penerimaan-santri-baru-2024',
                excerpt: 'Kami membuka kesempatan bagi putra-putri terbaik bangsa untuk bergabung menjadi bagian dari keluarga besar Pondok Pesantren.',
                content: '<p>Alhamdulillah, pendaftaran santri baru untuk tahun ajaran 2024/2025 telah resmi dibuka. Segera daftarkan diri Anda melalui website resmi SPMB kami.</p><p>Kuota terbatas!</p>',
                image_url: 'https://placehold.co/800x400/e97530/ffffff?text=PSB+2024',
                published_at: new Date(),
                status: 'published',
                category_id: categories['pengumuman'].id
            },
            {
                title: 'Malam Bina Iman dan Taqwa (MABIT) Santri Kelas Akhir',
                slug: 'malam-bina-iman-taqwa',
                excerpt: 'Kegiatan rutin bulanan untuk memperkuat ruhiyah santri sebelum menghadapi ujian akhir.',
                content: '<p>Kegiatan MABIT dilaksanakan dengan khidmat di Masjid Jami. Diisi dengan qiyamul lail, muhasabah, dan doa bersama.</p>',
                image_url: 'https://placehold.co/800x400/3A5650/ffffff?text=MABIT',
                published_at: new Date(),
                status: 'published',
                category_id: categories['kegiatan'].id
            },
            {
                title: 'Keutamaan Menuntut Ilmu Agama',
                slug: 'keutamaan-menuntut-ilmu',
                excerpt: 'Menuntut ilmu adalah kewajiban bagi setiap muslim. Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju surga.',
                content: '<p>Rasulullah SAW bersabda: "Barangsiapa yang menempuh suatu jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga." (HR. Muslim)</p>',
                image_url: 'https://placehold.co/800x400/5F7772/ffffff?text=Ilmu+Agama',
                published_at: new Date(),
                status: 'published',
                category_id: categories['artikel-islami'].id
            }
        ];

        for (const art of articlesData) {
            await db.Article.findOrCreate({
                where: { slug: art.slug },
                defaults: art
            });
        }
        console.log('✅ Articles seeded.');

        // 3. Banners
        const bannersData = [
            {
                title: 'Membangun Generasi Rabbani',
                subtitle: 'Pondok Pesantren Al-Mawahib',
                description: 'Mencetak kader ulama yang berintelektual dan berakhlakul karimah.',
                image_url: 'https://placehold.co/1200x600/1e293b/ffffff?text=Banner+Utama',
                button_text: 'Selengkapnya',
                button_url: '/profil',
                order: 1,
                is_active: true
            },
            {
                title: 'Pendaftaran Santri Baru',
                subtitle: 'Tahun Ajaran 2024/2025',
                description: 'Segera daftarkan putra-putri Anda. Kuota terbatas.',
                image_url: 'https://placehold.co/1200x600/e97530/ffffff?text=Daftar+Sekarang',
                button_text: 'Daftar Sekarang',
                button_url: 'http://localhost:5174', // URL SPMB
                order: 2,
                is_active: true
            }
        ];

        for (const banner of bannersData) {
            await db.Banner.findOrCreate({
                where: { title: banner.title },
                defaults: banner
            });
        }
        console.log('✅ Banners seeded.');

        // 4. Teachers
        const teachersData = [
            {
                name: 'KH. Abdullah Faqih',
                position: 'Pengasuh Pondok',
                image_url: 'https://placehold.co/400x400/333/fff?text=Kiyai',
                quote: 'Ilmu tanpa amal bagaikan pohon tanpa buah.',
                order: 1,
                is_active: true
            },
            {
                name: 'Ust. Ahmad Zaini',
                position: 'Kepala Madrasah',
                image_url: 'https://placehold.co/400x400/555/fff?text=Kepala',
                quote: 'Jadilah bermanfaat bagi orang lain.',
                order: 2,
                is_active: true
            },
            {
                name: 'Ustadzah Fatimah',
                position: 'Pengajar Tahfidz',
                image_url: 'https://placehold.co/400x400/777/fff?text=Ustadzah',
                quote: 'Al-Quran adalah pedoman hidup kita.',
                order: 3,
                is_active: true
            }
        ];

        for (const teacher of teachersData) {
            await db.Teacher.findOrCreate({
                where: { name: teacher.name },
                defaults: teacher
            });
        }
        console.log('✅ Teachers seeded.');



        // 6. Navbars
        const navbarsData = [
            { label: 'Beranda', url: '/', order: 1 },
            { label: 'Profil', url: '/page/profil', order: 2 },
            { label: 'Berita', url: '/news', order: 3 },
            { label: 'Galeri', url: '/galeri', order: 4 },
            { label: 'Kontak', url: '/page/kontak', order: 5 },
            { label: 'Pendaftaran', url: 'http://localhost:5174', order: 6 } // External link to SPMB
        ];

        for (const nav of navbarsData) {
            await db.Navbar.findOrCreate({
                where: { label: nav.label },
                defaults: nav
            });
        }
        console.log('✅ Navbars seeded.');

        // 7. Pages
        const pagesData = [
            {
                title: 'Profil Pesantren',
                slug: 'profil',
                content: '<h1>Sejarah Singkat</h1><p>Pondok Pesantren Al-Mawahib didirikan pada tahun...</p><h2>Visi & Misi</h2><p>Mencetak generasi yang...</p>',
                is_active: true
            },
            {
                title: 'Kontak Kami',
                slug: 'kontak',
                content: '<p>Hubungi kami melalui:</p><ul><li>Email: info@almawahib.sch.id</li><li>Telp: (021) 12345678</li></ul>',
                is_active: true
            }
        ];

        for (const page of pagesData) {
            await db.Page.findOrCreate({
                where: { slug: page.slug },
                defaults: page
            });
        }
        console.log('✅ Pages seeded.');




        console.log('✅ Website Data Seeding Complete!');

    } catch (error) {
        console.error('❌ Seeding Error:', error);
    } finally {
        process.exit();
    }
}

seedWebsiteData();
