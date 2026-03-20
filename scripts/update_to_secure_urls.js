/**
 * UPDATE IMAGE URLS TO SECURE ENDPOINT
 * 
 * Changes image URLs from:
 *   /public/website/filename.jpg
 * To:
 *   /api/images/website/filename.jpg
 * 
 * This allows backend to serve images through secure controller
 * 
 * Usage: node scripts/update_to_secure_urls.js
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

async function updateToSecureUrls() {
    console.log('===========================================');
    console.log('  UPDATE TO SECURE IMAGE URLS');
    console.log('===========================================\n');

    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        // Update Articles table
        console.log('📝 Updating Articles...');
        const [articlesResult] = await sequelize.query(`
            UPDATE Articles 
            SET image_url = REPLACE(image_url, '/public/website/', '/api/images/website/')
            WHERE image_url LIKE '/public/website/%'
        `);
        console.log(`   ✓ Updated ${articlesResult} articles\n`);

        // Update Banners table
        console.log('🖼️  Updating Banners...');
        const [bannersResult] = await sequelize.query(`
            UPDATE Banners 
            SET image_url = REPLACE(image_url, '/public/website/', '/api/images/website/')
            WHERE image_url LIKE '/public/website/%'
        `);
        console.log(`   ✓ Updated ${bannersResult} banners\n`);

        // Update Galleries table
        console.log('📸 Updating Galleries...');
        const [galleriesResult] = await sequelize.query(`
            UPDATE Galleries 
            SET image_url = REPLACE(image_url, '/public/website/', '/api/images/website/')
            WHERE image_url LIKE '/public/website/%'
        `);
        console.log(`   ✓ Updated ${galleriesResult} galleries\n`);

        // Update Teachers table
        console.log('👨‍🏫 Updating Teachers...');
        const [teachersResult] = await sequelize.query(`
            UPDATE Teachers 
            SET image_url = REPLACE(image_url, '/public/website/', '/api/images/website/')
            WHERE image_url LIKE '/public/website/%'
        `);
        console.log(`   ✓ Updated ${teachersResult} teachers\n`);

        // Verify results
        console.log('📊 Verification:');
        
        const [articleSamples] = await sequelize.query(`
            SELECT id, title, LEFT(image_url, 70) as image_url 
            FROM Articles 
            WHERE image_url LIKE '/api/images/%'
            LIMIT 3
        `);
        console.log('\n   Sample Articles (new URLs):');
        articleSamples.forEach(row => {
            console.log(`   - ${row.title}`);
            console.log(`     ${row.image_url}`);
        });

        const [bannerSamples] = await sequelize.query(`
            SELECT id, title, LEFT(image_url, 70) as image_url 
            FROM Banners 
            WHERE image_url LIKE '/api/images/%'
            LIMIT 3
        `);
        console.log('\n   Sample Banners (new URLs):');
        bannerSamples.forEach(row => {
            console.log(`   - ${row.title}`);
            console.log(`     ${row.image_url}`);
        });

        console.log('\n===========================================');
        console.log('  ✅ SECURE URLS UPDATE COMPLETE');
        console.log('===========================================\n');

        console.log('📝 IMPORTANT: Make sure the ImageController is active');
        console.log('   File: backend/controllers/ImageController.js\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

// Run update
updateToSecureUrls();
