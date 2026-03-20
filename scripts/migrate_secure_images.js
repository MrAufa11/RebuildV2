/**
 * SECURE IMAGE MIGRATION
 * 
 * This script:
 * 1. Renames images with random hash names
 * 2. Updates database with new secure URLs
 * 3. Creates mapping file for reference
 * 
 * Usage: node scripts/migrate_secure_images.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');

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

const UPLOADS_DIR = path.join(__dirname, '..', 'backend', 'uploads', 'website');
const MAPPING_FILE = path.join(UPLOADS_DIR, 'image_mapping.json');

/**
 * Generate random hash filename
 */
function generateHashFilename(originalFilename) {
    const ext = path.extname(originalFilename);
    const hash = crypto.randomBytes(16).toString('hex');
    return `${hash}${ext}`;
}

/**
 * Rename files and create mapping
 */
async function renameImages() {
    console.log('===========================================');
    console.log('  SECURE IMAGE MIGRATION');
    console.log('===========================================\n');

    const files = fs.readdirSync(UPLOADS_DIR);
    const imageFiles = files.filter(f => 
        !f.endsWith('.json') && 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
    );

    const mapping = {};
    let renamed = 0;
    let skipped = 0;

    console.log(`Found ${imageFiles.length} images to process\n`);

    imageFiles.forEach(oldName => {
        try {
            // Check if already renamed (has hash name)
            if (/^[a-f0-9]{32}\./.test(oldName)) {
                console.log(`⊘ Skipped (already hashed): ${oldName}`);
                skipped++;
                return;
            }

            const newName = generateHashFilename(oldName);
            const oldPath = path.join(UPLOADS_DIR, oldName);
            const newPath = path.join(UPLOADS_DIR, newName);

            // Rename file
            fs.renameSync(oldPath, newPath);
            
            // Store mapping
            mapping[oldName] = newName;

            renamed++;
            console.log(`✓ Renamed: ${oldName} → ${newName}`);
        } catch (error) {
            console.error(`✗ Error renaming ${oldName}: ${error.message}`);
        }
    });

    // Save mapping
    fs.writeFileSync(MAPPING_FILE, JSON.stringify({
        timestamp: new Date().toISOString(),
        total: imageFiles.length,
        renamed,
        skipped,
        mapping
    }, null, 2));

    console.log(`\n===========================================`);
    console.log(`  SUMMARY`);
    console.log(`===========================================`);
    console.log(`✓ Renamed: ${renamed}`);
    console.log(`⊘ Skipped: ${skipped}`);
    console.log(`📝 Mapping saved to: ${MAPPING_FILE}\n`);

    return mapping;
}

/**
 * Update database with new image URLs
 */
async function updateDatabase(mapping) {
    console.log('🗄️  Updating database...\n');

    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        let totalUpdated = 0;

        // Update Articles
        console.log('📝 Updating Articles...');
        for (const [oldName, newName] of Object.entries(mapping)) {
            const [result] = await sequelize.query(`
                UPDATE Articles 
                SET image_url = CONCAT('/api/images/website/', ?)
                WHERE image_url LIKE ?
            `, { replacements: [newName, `%${oldName}`] });
            
            if (result.changed > 0) {
                console.log(`   ✓ Updated: ${oldName} → ${newName}`);
                totalUpdated += result.changed;
            }
        }

        // Update Banners
        console.log('\n🖼️  Updating Banners...');
        for (const [oldName, newName] of Object.entries(mapping)) {
            const [result] = await sequelize.query(`
                UPDATE Banners 
                SET image_url = CONCAT('/api/images/website/', ?)
                WHERE image_url LIKE ?
            `, { replacements: [newName, `%${oldName}`] });
            
            if (result.changed > 0) {
                totalUpdated += result.changed;
            }
        }

        // Update Galleries
        console.log('\n📸 Updating Galleries...');
        for (const [oldName, newName] of Object.entries(mapping)) {
            const [result] = await sequelize.query(`
                UPDATE Galleries 
                SET image_url = CONCAT('/api/images/website/', ?)
                WHERE image_url LIKE ?
            `, { replacements: [newName, `%${oldName}`] });
            
            if (result.changed > 0) {
                totalUpdated += result.changed;
            }
        }

        // Update Teachers
        console.log('\n👨‍🏫 Updating Teachers...');
        for (const [oldName, newName] of Object.entries(mapping)) {
            const [result] = await sequelize.query(`
                UPDATE Teachers 
                SET image_url = CONCAT('/api/images/website/', ?)
                WHERE image_url LIKE ?
            `, { replacements: [newName, `%${oldName}`] });
            
            if (result.changed > 0) {
                totalUpdated += result.changed;
            }
        }

        console.log(`\n===========================================`);
        console.log(`  DATABASE UPDATE COMPLETE`);
        console.log(`===========================================`);
        console.log(`✓ Total records updated: ${totalUpdated}\n`);

    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await sequelize.close();
    }
}

/**
 * Main function
 */
async function main() {
    const confirm = process.argv.includes('--yes') || 
        process.env.AUTO_CONFIRM === 'true';

    if (!confirm) {
        console.log('⚠️  WARNING: This will rename ALL images and update database!');
        console.log('   Make sure you have a backup before proceeding.\n');
        
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Continue? (yes/no): ', answer => {
            readline.close();
            if (answer.toLowerCase() === 'yes') {
                runMigration();
            } else {
                console.log('❌ Cancelled');
                process.exit(0);
            }
        });
    } else {
        runMigration();
    }
}

async function runMigration() {
    const mapping = await renameImages();
    await updateDatabase(mapping);
    
    console.log('✅ Secure image migration completed!\n');
    console.log('📝 IMPORTANT: Save the mapping file for reference!');
    console.log('   Location:', MAPPING_FILE);
}

main();
