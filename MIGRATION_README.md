# Website Data Migration Guide

Dokumentasi untuk migrasi data website dari database lama ke database baru `rebuild_v2`.

## 📋 Overview

Proses migrasi ini mencakup:
1. **Data Assets** (Images) - Copy dari `/img` ke `backend/uploads/website`
2. **Database** - Migrasi data dari `old_almawa` ke `rebuild_v2`
3. **Image Paths** - Update path images di database

## 🗂️ Data yang Dimigrasi

| Tabel Lama | Tabel Baru | Keterangan |
|-----------|-----------|------------|
| `kategori_image` | `Categories` | Kategori galeri |
| `kategori_berita` | `Categories` | Kategori artikel |
| `artikel` | `Articles` | Artikel website |
| `berita` | `Articles` | Berita website |
| `banner` | `Banners` | Banner homepage |
| `galeri` | `Galleries` | Galeri foto |
| `about` | `Pages` | Halaman about |
| `halaman` | `Pages` | Halaman statis |
| `guru` | `Teachers` | Data guru |

## 🚀 Langkah-langkah Migrasi

### 1. Migrasi Images (Assets)

Copy semua images dari folder `/img` ke `backend/uploads/website`:

```bash
cd /home/aufa/Public/RebuildV2
node scripts/migrate_images.js
```

**Hasil:**
- Images akan dicopy ke `backend/uploads/website/`
- Log migrasi tersimpan di `backend/uploads/website/migration_log.json`

### 2. Migrasi Database

Jalankan script SQL migrasi:

```bash
# Masuk ke MySQL/MariaDB
mysql -u root -p

# Gunakan database rebuild_v2
USE rebuild_v2;

# Source file migrasi
SOURCE /home/aufa/Public/RebuildV2/migrate_website_data.sql;
```

**Atau via command line:**
```bash
mysql -u root -p rebuild_v2 < /home/aufa/Public/RebuildV2/migrate_website_data.sql
```

### 3. Update Image Paths (Optional)

Jika ada image path yang belum benar, jalankan script update:

```bash
node scripts/update_image_paths.js
```

## 📁 Struktur Folder Images

```
backend/uploads/website/
├── artikel/        (images dari artikel)
├── banner/         (images dari banner)
├── berita/         (images dari berita)
├── gallery/        (images dari galeri)
├── guru/           (images dari guru)
├── about/          (images dari about)
└── team/           (images dari team)
```

## 🔍 Verifikasi

### Cek Images
```bash
ls -la backend/uploads/website/
```

### Cek Database
```sql
USE rebuild_v2;

-- Cek jumlah data
SELECT 'Categories' as table_name, COUNT(*) as count FROM Categories
UNION ALL
SELECT 'Articles', COUNT(*) FROM Articles
UNION ALL
SELECT 'Banners', COUNT(*) FROM Banners
UNION ALL
SELECT 'Galleries', COUNT(*) FROM Galleries
UNION ALL
SELECT 'Pages', COUNT(*) FROM Pages
UNION ALL
SELECT 'Teachers', COUNT(*) FROM Teachers;

-- Cek sample images
SELECT title, image_url FROM Articles LIMIT 5;
SELECT title, image_url FROM Banners LIMIT 5;
SELECT title, image_url FROM Galleries LIMIT 5;
SELECT name, image_url FROM Teachers LIMIT 5;
```

## 🛠️ Troubleshooting

### Images tidak muncul
1. Pastikan images sudah dicopy ke `backend/uploads/website/`
2. Cek path di database harus format: `/public/website/nama_file.jpg`
3. Pastikan backend serve folder `public/` dengan benar

### Error saat migrasi database
1. Pastikan database `old_almawa` masih accessible
2. Pastikan database `rebuild_v2` sudah dibuat
3. Cek foreign key constraints

### Duplikasi data
Script migrasi menggunakan `ON DUPLICATE KEY UPDATE` untuk menghindari duplikasi.
Jika ingin reset, truncate tabel terlebih dahulu:

```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Articles;
TRUNCATE TABLE Banners;
TRUNCATE TABLE Galleries;
TRUNCATE TABLE Pages;
TRUNCATE TABLE Teachers;
SET FOREIGN_KEY_CHECKS = 1;
```

## 📝 Notes

- Script migrasi sudah idempotent (aman dijalankan berkali-kali)
- Images yang sudah ada tidak akan di-copy ulang (skip)
- Backup database sebelum migrasi: `mysqldump rebuild_v2 > backup_rebuild_v2.sql`

## ✅ Checklist

- [ ] Backup database `rebuild_v2`
- [ ] Jalankan `migrate_images.js`
- [ ] Verifikasi images ter-copy
- [ ] Jalankan `migrate_website_data.sql`
- [ ] Verifikasi data di database
- [ ] Test website frontend
- [ ] Clear cache jika perlu
