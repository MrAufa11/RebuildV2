// Load all models from the main models index
const mainModels = require('../../../../models');

// Export specific models for Website app
const models = {
    Article: mainModels.Article,
    Banner: mainModels.Banner,
    Gallery: mainModels.Gallery,
    Teacher: mainModels.Teacher,
    Category: mainModels.WebsiteCategory,
    WebsiteCategory: mainModels.WebsiteCategory,
    Setting: mainModels.Setting,
    Navbar: mainModels.Navbar,
    
    // Also include shared models if needed
    User: mainModels.User,
    Role: mainModels.Role,
    
    // Export Sequelize and Op for convenience
    Sequelize: mainModels.Sequelize,
    Op: mainModels.Op
};

module.exports = models;
