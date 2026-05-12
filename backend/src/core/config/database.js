require('dotenv').config();

const baseConfig = {
    dialect: 'mysql',
    timezone: '+07:00',
    // Disable SQL logging in production, enable in development if needed
    logging: process.env.DB_LOGGING === 'true' ? console.log : false
};

module.exports = {
    // Master Database (users, tokens, roles, permissions)
    master: {
        ...baseConfig,
        username: process.env.DB_MASTER_USER || process.env.DB_USER,
        password: process.env.DB_MASTER_PASS || process.env.DB_PASS,
        database: process.env.DB_MASTER_NAME || 'master_db',
        host: process.env.DB_MASTER_HOST || process.env.DB_HOST,
        port: process.env.DB_MASTER_PORT || 3306 // Docker mapping handles port if accessed externally, but internal is 3306
    },

    // Website Database (content, galleries, etc - matches original structure)
    website: {
        ...baseConfig,
        username: process.env.DB_WEBSITE_USER || process.env.DB_USER,
        password: process.env.DB_WEBSITE_PASS || process.env.DB_PASS,
        database: process.env.DB_WEBSITE_NAME || process.env.DB_NAME,
        host: process.env.DB_WEBSITE_HOST || process.env.DB_HOST,
        port: process.env.DB_WEBSITE_PORT || 3306
    },

    // SPMB Database (Student Admissions)
    spmb: {
        ...baseConfig,
        username: process.env.DB_SPMB_USER || process.env.DB_USER,
        password: process.env.DB_SPMB_PASS || process.env.DB_PASS,
        database: process.env.DB_SPMB_NAME || 'spmb',
        host: process.env.DB_SPMB_HOST || process.env.DB_HOST,
        port: process.env.DB_SPMB_PORT || 3306
    },

    // Keuangan Database (Finance)
    keuangan: {
        ...baseConfig,
        username: process.env.DB_KEUANGAN_USER || process.env.DB_USER,
        password: process.env.DB_KEUANGAN_PASS || process.env.DB_PASS,
        database: process.env.DB_KEUANGAN_NAME || 'keuangan_db',
        host: process.env.DB_KEUANGAN_HOST || process.env.DB_HOST,
        port: process.env.DB_KEUANGAN_PORT || 3306
    }
};
