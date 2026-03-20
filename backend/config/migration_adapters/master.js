const config = require('../database');

module.exports = {
    development: config.master,
    test: config.master,
    production: config.master
};
