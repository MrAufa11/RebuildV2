const fs = require('fs');
const path = require('path');

// Load all models from this directory
const models = {};

// Get the Sequelize instance from the main models
const mainModels = require('../../../../models');

// Export specific models for this app
models.User = mainModels.User;
models.Role = mainModels.Role;
models.Token = mainModels.Token;
models.App = mainModels.App;
models.Menu = mainModels.Menu;
models.RoleMenuPermissions = mainModels.RoleMenuPermissions;

// Export Sequelize and Op for convenience
models.Sequelize = mainModels.Sequelize;
models.Op = mainModels.Op;

module.exports = models;
