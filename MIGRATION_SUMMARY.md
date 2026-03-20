# ✅ WEBSITE DATA MIGRATION - COMPLETED

## 📊 Migration Summary

Successfully migrated all website data from `old_almawa` database to `rebuild_v2` database.

### Migration Results

| Table | Records Migrated | Status |
|-------|-----------------|--------|
| Categories | 92 | ✅ |
| Articles | 17 | ✅ |
| Banners | 10 | ✅ |
| Galleries | 86 | ✅ |
| Pages | 7 | ✅ |
| Teachers | 37 | ✅ |

### Images Migration

- **Total Images Copied:** 221 files
- **Source:** `/img/` directory
- **Destination:** `backend/uploads/website/`
- **Skipped (already exists):** 8 files
- **Errors:** 0

## 📁 Files Created

1. **`migrate_website_data.sql`** - SQL script for database migration
2. **`scripts/migrate_images.js`** - Node.js script for image migration
3. **`scripts/update_image_paths.js`** - Node.js script to update image paths (if needed)
4. **`MIGRATION_README.md`** - Complete migration documentation
5. **`MIGRATION_SUMMARY.md`** - This file

## 🔄 What Was Migrated

### From Database `old_almawa`:
- `kategori_image` → `Categories` (Gallery categories)
- `kategori_berita` → `Categories` (Article categories)
- `artikel` → `Articles`
- `berita` → `Articles`
- `banner` → `Banners`
- `galeri` → `Galleries`
- `about` → `Pages`
- `halaman` → `Pages`
- `guru` → `Teachers`

### Images From `/img/`:
- `/img/artikel/` → Article images
- `/img/banner/` → Banner images
- `/img/berita/` → News images
- `/img/gallery/` → Gallery images
- `/img/guru/` → Teacher images
- `/img/about/` → About page images
- `/img/team/` → Team images
- Root level images

## 🎯 Image Path Format

All images now follow the format:
```
/public/website/[filename].[ext]
```

Examples:
- `/public/website/bu_iis_3x4.jpg`
- `/public/website/WhatsApp_Image_2024-05-29_at_05_57_33_7f1c10c5.jpg`
- `/public/website/almawahib7.jpg`

## 🚀 How to Re-run Migration

If you need to re-run the migration (e.g., after resetting the database):

### 1. Reset Database (Optional)
```sql
USE rebuild_v2;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Articles;
TRUNCATE TABLE Banners;
TRUNCATE TABLE Galleries;
TRUNCATE TABLE Pages;
TRUNCATE TABLE Teachers;
TRUNCATE TABLE Categories;
SET FOREIGN_KEY_CHECKS = 1;
```

### 2. Run Image Migration
```bash
node scripts/migrate_images.js
```

### 3. Run Database Migration
```bash
docker exec -i database mysql -u root -proot rebuild_v2 < migrate_website_data.sql
```

## ✅ Verification Commands

### Check Data Counts
```bash
docker exec database mysql -u root -proot rebuild_v2 -e "
SELECT 'Categories' as tbl, COUNT(*) as count FROM Categories 
UNION ALL SELECT 'Articles', COUNT(*) FROM Articles 
UNION ALL SELECT 'Banners', COUNT(*) FROM Banners 
UNION ALL SELECT 'Galleries', COUNT(*) FROM Galleries 
UNION ALL SELECT 'Pages', COUNT(*) FROM Pages 
UNION ALL SELECT 'Teachers', COUNT(*) FROM Teachers;"
```

### Check Sample Images
```bash
docker exec database mysql -u root -proot rebuild_v2 -e "
SELECT title, image_url FROM Articles WHERE image_url LIKE '/public/website/%' LIMIT 5;"
```

### Check Uploaded Files
```bash
ls -la backend/uploads/website/ | head -20
```

## 📝 Notes

1. **Idempotent Migration**: All scripts are safe to run multiple times
   - Images: Skips files that already exist
   - Database: Uses `ON DUPLICATE KEY UPDATE`

2. **Content Truncation**: Some long content in Pages table was truncated to fit TEXT column (60KB limit)

3. **Default Values**: 
   - Author ID: Set to 1 for all migrated articles
   - Timestamps: Set to NOW() for createdAt and updatedAt

4. **Image Paths**: All image paths are relative to `/public/website/` which is served by the backend

## 🎉 Next Steps

1. ✅ Migration completed successfully!
2. Test the website frontend to ensure images load correctly
3. Clear browser cache if images don't appear
4. Deploy to production when ready

## 📞 Support

If you encounter any issues:
1. Check `backend/uploads/website/migration_log.json` for image migration details
2. Check MySQL error logs for database issues
3. Verify backend is serving `/public/` directory correctly
