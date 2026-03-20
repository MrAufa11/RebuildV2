const config = require('../database');

module.exports = {
    development: config.website,
    test: config.website,
    production: config.website
};
