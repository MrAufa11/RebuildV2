#!/bin/bash

# ============================================
# CLEANUP MIGRATION FILES (OPTIONAL)
# ============================================
# Run this script if you want to reset and re-migrate from scratch

echo "============================================"
echo "  WEBSITE MIGRATION CLEANUP"
echo "============================================"
echo ""

# Ask for confirmation
read -p "⚠️  This will reset all migrated data. Continue? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "🗑️  Cleaning up..."

# 1. Remove uploaded images (optional - commented out by default)
# echo "📁 Removing images from backend/uploads/website/..."
# rm -rf backend/uploads/website/*
# echo "   ✓ Images removed"

# 2. Reset database tables
echo "🗄️  Resetting database tables..."
docker exec database mysql -u root -proot rebuild_v2 -e "
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Articles;
TRUNCATE TABLE Banners;
TRUNCATE TABLE Galleries;
TRUNCATE TABLE Pages;
TRUNCATE TABLE Teachers;
TRUNCATE TABLE Categories;
SET FOREIGN_KEY_CHECKS = 1;
"
echo "   ✓ Database tables reset"

echo ""
echo "============================================"
echo "  ✅ CLEANUP COMPLETED"
echo "============================================"
echo ""
echo "You can now re-run migration:"
echo "  1. node scripts/migrate_images.js"
echo "  2. docker exec -i database mysql -u root -proot rebuild_v2 < migrate_website_data.sql"
echo ""
