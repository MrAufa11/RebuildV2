const config = require('../database');

module.exports = {
    development: config.spmb,
    test: config.spmb,
    production: config.spmb
};
