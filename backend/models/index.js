'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/database.js');

const db = {};

// Create distinct Sequelize instances for each database
const databases = {
  master: new Sequelize(config.master.database, config.master.username, config.master.password, config.master),
  website: new Sequelize(config.website.database, config.website.username, config.website.password, config.website),
  spmb: new Sequelize(config.spmb.database, config.spmb.username, config.spmb.password, config.spmb),
  keuangan: new Sequelize(config.keuangan.database, config.keuangan.username, config.keuangan.password, config.keuangan)
};

// Helper function to load models from a directory
const loadModels = (dirName, sequelizeInstance) => {
  const modelDir = path.join(__dirname, dirName);

  if (!fs.existsSync(modelDir)) return;

  fs.readdirSync(modelDir)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(modelDir, file))(sequelizeInstance, Sequelize.DataTypes);
      db[model.name] = model;
    });
};

// Load models from each subdirectory
loadModels('master', databases.master);
loadModels('website', databases.website);
loadModels('spmb', databases.spmb);
loadModels('keuangan', databases.keuangan);

// Initialize associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instances to db object
db.sequelize = databases.master;
db.Sequelize = Sequelize;

// Export all instances for specific usage
db.databases = databases;

module.exports = db;
