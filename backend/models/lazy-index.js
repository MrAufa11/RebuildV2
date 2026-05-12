'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/database.js');

// Lazy-loaded database instances
const databases = {};
const db = {};
const loadedApps = new Set();

// Sequelize constructor
const SequelizeClass = Sequelize;

/**
 * Lazy load a specific database
 * @param {string} appName - Name of the database to load
 */
function loadDatabase(appName) {
  if (loadedApps.has(appName)) return;
  
  if (!config[appName]) {
    console.warn(`⚠️  Database config not found for: ${appName}`);
    return;
  }

  try {
    databases[appName] = new Sequelize(
      config[appName].database,
      config[appName].username,
      config[appName].password,
      config[appName]
    );
    loadedApps.add(appName);
    console.log(`✅ [${appName}] Database loaded lazily`);
  } catch (error) {
    console.error(`❌ [${appName}] Failed to load database:`, error.message);
  }
}

/**
 * Get database instance, loading it if necessary
 * @param {string} appName - Name of the database
 * @returns {Sequelize|null} Database instance or null
 */
function getDatabase(appName) {
  if (!databases[appName]) {
    loadDatabase(appName);
  }
  return databases[appName] || null;
}

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
      const model = require(path.join(modelDir, file))(sequelizeInstance, SequelizeClass.DataTypes);
      db[model.name] = model;
    });
};

// Lazy load models for a specific app
function loadAppModels(appName) {
  if (loadedApps.has(appName)) return;
  
  const dbInstance = getDatabase(appName);
  if (!dbInstance) return;
  
  loadModels(appName, dbInstance);
  
  // Initialize associations for this app's models
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate && db[modelName].modelName === appName) {
      db[modelName].associate(db);
    }
  });
}

// Load all databases (for backward compatibility)
function loadAllDatabases() {
  ['master', 'website', 'spmb', 'keuangan'].forEach(loadDatabase);
}

// Initialize associations for all loaded models
function initializeAssociations() {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

// Export lazy loading functions
db.getDatabase = getDatabase;
db.loadDatabase = loadDatabase;
db.loadAppModels = loadAppModels;
db.loadAllDatabases = loadAllDatabases;
db.initializeAssociations = initializeAssociations;

// Proxy for backward compatibility - auto-load on first access
const dbProxy = new Proxy(db, {
  get(target, prop) {
    if (prop === 'databases') {
      loadAllDatabases();
      return databases;
    }
    if (prop === 'sequelize' || prop === 'Sequelize') {
      loadDatabase('master');
      return prop === 'sequelize' ? databases.master : SequelizeClass;
    }
    if (['master', 'website', 'spmb', 'keuangan'].includes(prop)) {
      loadAppModels(prop);
      return target[prop];
    }
    return target[prop];
  }
});

// Export proxy
module.exports = dbProxy;
