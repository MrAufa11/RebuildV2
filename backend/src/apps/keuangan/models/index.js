// Load all models from the main models index
const mainModels = require('../../../../models');

// Export specific models for Keuangan app
const models = {
    // Add keuangan-specific models here when created
    // For now, include any shared models that might be needed
    
    // Fee model (if exists in main models)
    Fee: mainModels.Fee || null,
    
    // Also include shared models if needed
    User: mainModels.User,
    Role: mainModels.Role,
    
    // Export Sequelize and Op for convenience
    Sequelize: mainModels.Sequelize,
    Op: mainModels.Op
};

module.exports = models;
