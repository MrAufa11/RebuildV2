/**
 * MIGRATE WEBSITE IMAGES
 * 
 * This script copies images from old /img directory to backend/uploads/website
 * for the new rebuild_v2 website.
 * 
 * Usage: node scripts/migrate_images.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_IMG_DIR = path.join(__dirname, '..', 'img');
const DEST_UPLOADS_DIR = path.join(__dirname, '..', 'backend', 'uploads', 'website');

// Image extensions to migrate
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Directories to migrate (subdirectories of /img)
const DIRECTORIES_TO_MIGRATE = [
    'artikel',
    'banner',
    'berita',
    'gallery',
    'guru',
    'about',
    'team',
];

// Statistics
let totalCopied = 0;
let totalSkipped = 0;
let totalErrors = 0;
const copiedFiles = [];
const skippedFiles = [];
const errorFiles = [];

/**
 * Check if file has valid image extension
 */
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Copy a single file
 */
function copyFile(source, destination) {
    try {
        // Create destination directory if not exists
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(source, destination);
        totalCopied++;
        copiedFiles.push({ source, destination });
        console.log(`✓ Copied: ${path.relative(SOURCE_IMG_DIR, source)}`);
    } catch (err) {
        totalErrors++;
        errorFiles.push({ source, destination, error: err.message });
        console.error(`✗ Error copying ${source}: ${err.message}`);
    }
}

/**
 * Migrate files from a directory
 */
function migrateDirectory(subDir) {
    const sourceDir = path.join(SOURCE_IMG_DIR, subDir);
    const destDir = DEST_UPLOADS_DIR;

    if (!fs.existsSync(sourceDir)) {
        console.warn(`⚠ Directory not found: ${subDir}`);
        return;
    }

    console.log(`\n📁 Migrating: ${subDir}/`);

    const files = fs.readdirSync(sourceDir);
    
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        // Skip directories
        if (fs.statSync(sourcePath).isDirectory()) {
            return;
        }

        // Only copy image files
        if (!isImageFile(file)) {
            totalSkipped++;
            skippedFiles.push({ file, reason: 'Not an image' });
            return;
        }

        // Check if file already exists
        if (fs.existsSync(destPath)) {
            totalSkipped++;
            skippedFiles.push({ file, reason: 'Already exists' });
            console.log(`⊘ Skipped (exists): ${file}`);
            return;
        }

        copyFile(sourcePath, destPath);
    });
}

/**
 * Migrate root level images (not in subdirectories)
 */
function migrateRootImages() {
    console.log(`\n📁 Migrating: root level images`);

    const files = fs.readdirSync(SOURCE_IMG_DIR);

    files.forEach(file => {
        const sourcePath = path.join(SOURCE_IMG_DIR, file);

        // Skip directories
        if (fs.statSync(sourcePath).isDirectory()) {
            return;
        }

        // Only copy image files
        if (!isImageFile(file)) {
            return;
        }

        const destPath = path.join(DEST_UPLOADS_DIR, file);

        // Check if file already exists
        if (fs.existsSync(destPath)) {
            console.log(`⊘ Skipped (exists): ${file}`);
            return;
        }

        copyFile(sourcePath, destPath);
    });
}

/**
 * Main migration function
 */
function migrate() {
    console.log('===========================================');
    console.log('  WEBSITE IMAGE MIGRATION');
    console.log('===========================================\n');

    console.log(`Source: ${SOURCE_IMG_DIR}`);
    console.log(`Destination: ${DEST_UPLOADS_DIR}`);
    console.log(`Directories to migrate: ${DIRECTORIES_TO_MIGRATE.join(', ')}`);

    // Create destination directory if not exists
    if (!fs.existsSync(DEST_UPLOADS_DIR)) {
        fs.mkdirSync(DEST_UPLOADS_DIR, { recursive: true });
        console.log(`\n✓ Created destination directory: ${DEST_UPLOADS_DIR}`);
    }

    // Migrate subdirectories
    DIRECTORIES_TO_MIGRATE.forEach(dir => {
        migrateDirectory(dir);
    });

    // Also migrate root level images
    migrateRootImages();

    // Print summary
    console.log('\n===========================================');
    console.log('  MIGRATION SUMMARY');
    console.log('===========================================');
    console.log(`✓ Total copied: ${totalCopied}`);
    console.log(`⊘ Total skipped: ${totalSkipped}`);
    console.log(`✗ Total errors: ${totalErrors}`);

    if (errorFiles.length > 0) {
        console.log('\n❌ Errors:');
        errorFiles.forEach(item => {
            console.log(`  - ${item.source}: ${item.error}`);
        });
    }

    console.log('\n===========================================\n');

    // Write migration log
    const logFile = path.join(DEST_UPLOADS_DIR, 'migration_log.json');
    fs.writeFileSync(logFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            totalCopied,
            totalSkipped,
            totalErrors
        },
        copiedFiles,
        skippedFiles,
        errorFiles
    }, null, 2));

    console.log(`📝 Migration log saved to: ${logFile}\n`);
}

// Run migration
migrate();
