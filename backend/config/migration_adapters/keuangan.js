const config = require('../database');

module.exports = {
    development: config.keuangan,
    test: config.keuangan,
    production: config.keuangan
};
