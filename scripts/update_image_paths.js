/**
 * UPDATE IMAGE PATHS IN DATABASE
 * 
 * This script updates image paths in the database to ensure
 * all images point to the correct /public/website/ path.
 * 
 * Usage: node scripts/update_image_paths.js
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

// Database configuration
const sequelize = new Sequelize(
    process.env.DB_NAME || 'rebuild_v2',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

async function updateImagePaths() {
    console.log('===========================================');
    console.log('  UPDATE IMAGE PATHS IN DATABASE');
    console.log('===========================================\n');

    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        // Update Articles table
        console.log('📝 Updating Articles...');
        const [articlesResults] = await sequelize.query(`
            UPDATE Articles 
            SET image_url = CONCAT('/public/website/', SUBSTRING_INDEX(image_url, '/', -1))
            WHERE image_url NOT LIKE '/public/website/%'
            AND image_url IS NOT NULL
            AND image_url != ''
        `);
        console.log(`   ✓ Updated ${articlesResults} articles\n`);

        // Update Banners table
        console.log('🖼️  Updating Banners...');
        const [bannersResults] = await sequelize.query(`
            UPDATE Banners 
            SET image_url = CONCAT('/public/website/', SUBSTRING_INDEX(image_url, '/', -1))
            WHERE image_url NOT LIKE '/public/website/%'
            AND image_url IS NOT NULL
            AND image_url != ''
        `);
        console.log(`   ✓ Updated ${bannersResults} banners\n`);

        // Update Galleries table
        console.log('📸 Updating Galleries...');
        const [galleriesResults] = await sequelize.query(`
            UPDATE Galleries 
            SET image_url = CONCAT('/public/website/', SUBSTRING_INDEX(image_url, '/', -1))
            WHERE image_url NOT LIKE '/public/website/%'
            AND image_url IS NOT NULL
            AND image_url != ''
        `);
        console.log(`   ✓ Updated ${galleriesResults} galleries\n`);

        // Update Teachers table
        console.log('👨‍🏫 Updating Teachers...');
        const [teachersResults] = await sequelize.query(`
            UPDATE Teachers 
            SET image_url = CONCAT('/public/website/', SUBSTRING_INDEX(image_url, '/', -1))
            WHERE image_url NOT LIKE '/public/website/%'
            AND image_url IS NOT NULL
            AND image_url != ''
        `);
        console.log(`   ✓ Updated ${teachersResults} teachers\n`);

        // Verify results
        console.log('📊 Verification:');
        const [articleSamples] = await sequelize.query(`
            SELECT id, title, image_url 
            FROM Articles 
            LIMIT 5
        `);
        console.log('\n   Sample Articles:');
        articleSamples.forEach(row => {
            console.log(`   - ${row.title}: ${row.image_url}`);
        });

        const [bannerSamples] = await sequelize.query(`
            SELECT id, title, image_url 
            FROM Banners 
            LIMIT 5
        `);
        console.log('\n   Sample Banners:');
        bannerSamples.forEach(row => {
            console.log(`   - ${row.title}: ${row.image_url}`);
        });

        console.log('\n===========================================');
        console.log('  ✅ IMAGE PATHS UPDATED SUCCESSFULLY');
        console.log('===========================================\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

// Run update
updateImagePaths();
