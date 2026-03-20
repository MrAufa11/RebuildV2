const { Sequelize } = require('sequelize');
const config = require('../config/database.js').website;

// Override host for verification script inside container
config.host = 'db'; // Force host since we are running inside container
config.port = 3306;

const sequelize = new Sequelize(config.database, config.username, config.password, config);

async function verify() {
    try {
        console.log('Checking Categories table...');
        const [results] = await sequelize.query("DESCRIBE Categories;");
        console.table(results);

        const hasSlug = results.some(r => r.Field === 'slug');
        console.log('Has Slug:', hasSlug);

        const hasType = results.some(r => r.Field === 'type');
        console.log('Has Type:', hasType);

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

verify();
