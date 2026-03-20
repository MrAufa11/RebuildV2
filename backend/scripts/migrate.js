const { exec } = require('child_process');
const path = require('path');

const databases = ['master', 'website', 'spmb', 'keuangan'];

const runMigration = (dbName) => {
    return new Promise((resolve, reject) => {
        console.log(`\n🚀 Running migrations for: ${dbName.toUpperCase()}...`);

        const configPath = path.join(__dirname, `../config/migration_adapters/${dbName}.js`);
        const migrationsPath = path.join(__dirname, `../migrations/${dbName}`);

        // Command: npx sequelize-cli db:migrate --config ... --migrations-path ...
        const cmd = `npx sequelize-cli db:migrate --config "${configPath}" --migrations-path "${migrationsPath}"`;

        // Execute command in the 'backend' directory so npx finds local modules
        exec(cmd, { cwd: path.join(__dirname, '../') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error migrating ${dbName}:`, error.message);
                console.error(stderr);
                reject(error);
                return;
            }
            if (stderr) {
                console.warn(`⚠️  Warning ${dbName}:`, stderr);
            }
            console.log(stdout);
            console.log(`✅ ${dbName.toUpperCase()} Migrated Successfully.`);
            resolve();
        });
    });
};

const migrateAll = async () => {
    for (const db of databases) {
        try {
            await runMigration(db);
        } catch (error) {
            console.error('Migration failed, stopping.');
            process.exit(1);
        }
    }
    console.log('\n✨ All migrations completed successfully!');
};

// Check for arguments (e.g., node migrate.js master)
const args = process.argv.slice(2);
if (args.length > 0) {
    const target = args[0];
    if (databases.includes(target)) {
        runMigration(target);
    } else {
        console.error(`Unknown database: ${target}. Available: ${databases.join(', ')}`);
    }
} else {
    migrateAll();
}
