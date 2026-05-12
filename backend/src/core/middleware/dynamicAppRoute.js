/**
 * Dynamic App Route Middleware
 * 
 * Middleware for handling dynamic routing based on application name from URL.
 * Validates app against Master Database with in-memory caching.
 * Implements lazy loading for database connection pools.
 * 
 * Usage:
 *   app.use('/api/:appName/*', dynamicAppRoute);
 * 
 * Flow:
 * 1. Extract appName from URL parameter
 * 2. Validate app against Master Database (with caching)
 * 3. Get database credentials for the app
 * 4. Create/retrieve connection pool (lazy loading)
 * 5. Inject req.appDb for downstream controllers
 */

const { getOrCreatePool } = require('./appDatabasePool');
const db = require('../models');

// In-memory cache for app validation and credentials
// TTL: 5 minutes (300000ms)
const APP_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000;

/**
 * List of reserved route names that should NOT be treated as app names
 * These routes have special meaning and are handled separately
 */
const RESERVED_ROUTE_NAMES = [
  'admin',         // Admin API bypass
  'spmb',          // SPMB API bypass
  'public',        // Public CMS endpoints
  'uploads',       // File uploads
  'images',        // Image serving
  'auth',          // Authentication
  'users',         // User management
  'tokens',        // Token management
  'menus',         // Menu management
  'roles',         // Role management
  'permissions',   // Permission management
  'upload',        // File upload endpoint
  'students',      // Student data
  'data-leads',    // Data leads
  'registrants',   // Registrants
  'bank',          // Reference data
  'schedule-detail',
  'discount',
  'format',
  'fee',
  'position',
  'school-data',
  'building-setup',
  'room-setup',
  'discount-setup',
  'academic-year-setup',
  'life-status',
  'requirement-master',
  'education-level',
  'voucher',
  'selection-schedule',
  'classroom',
  'exam-number',
  'occupation',
  'income',
  'selection-type',
  '.well-known',   // Monitoring endpoints
  'items'          // Example dynamic routes
];

/**
 * Check if a route name is reserved
 * 
 * @param {string} name - Route name to check
 * @returns {boolean} - True if reserved
 */
function isReservedRoute(name) {
  return RESERVED_ROUTE_NAMES.includes(name);
}

/**
 * Get app from cache with TTL check
 * 
 * @param {string} appCode - Application code
 * @returns {object|null} - Cached app data or null
 */
function getCachedApp(appCode) {
  const cached = APP_CACHE.get(appCode);
  
  if (!cached) return null;
  
  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    APP_CACHE.delete(appCode);
    return null;
  }
  
  return cached.data;
}

/**
 * Set app in cache with timestamp
 * 
 * @param {string} appCode - Application code
 * @param {object} appData - App data to cache
 */
function setCachedApp(appCode, appData) {
  const timestamp = new Date().toLocaleTimeString('id-ID');
  APP_CACHE.set(appCode, {
    data: appData,
    timestamp: Date.now()
  });
}

/**
 * Clear expired cache entries
 * Called periodically to clean up stale entries
 */
function clearExpiredCache() {
  const now = Date.now();
  for (const [appCode, cached] of APP_CACHE.entries()) {
    if (now - cached.timestamp > CACHE_TTL) {
      APP_CACHE.delete(appCode);
    }
  }
}

// Run cache cleanup every 10 minutes
setInterval(clearExpiredCache, 10 * 60 * 1000);

/**
 * Fetch app from Master Database
 * 
 * @param {string} appCode - Application code to validate
 * @returns {Promise<object|null>} - App data or null if not found
 */
async function fetchAppFromMaster(appCode) {
  try {
    const AppModel = db.databases.master.models.App;
    
    if (!AppModel) {
      return null;
    }
    
    const app = await AppModel.findOne({
      where: { code: appCode },
      attributes: ['id', 'code', 'name', 'description']
    });
    
    return app ? app.toJSON() : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get or create app database configuration
 * 
 * Priority:
 * 1. Environment variables (DB_[APPNAME]_*)
 * 2. Default database configuration based on app code
 * 3. Global database credentials (DB_USER, DB_PASS, etc.)
 * 
 * @param {string} appCode - Application code
 * @returns {object|null} - Database configuration or null
 */
function getAppDatabaseConfig(appCode) {
  const timestamp = new Date().toLocaleTimeString('id-ID');
  
  // Try to get from environment variables first
  const envPrefix = `DB_${appCode.toUpperCase()}`;
  
  // Check what's actually in process.env
  const hasGlobalUser = !!process.env.DB_USER;
  const hasGlobalPass = !!process.env.DB_PASS;
  const hasAppUser = !!process.env[`${envPrefix}_USER`];
  const hasAppPass = !!process.env[`${envPrefix}_PASS`];
  
  
  const envConfig = {
    host: process.env[`${envPrefix}_HOST`] || process.env.DB_HOST,
    port: process.env[`${envPrefix}_PORT`] || process.env.DB_PORT || 3306,
    username: process.env[`${envPrefix}_USER`] || process.env.DB_USER,
    password: process.env[`${envPrefix}_PASS`] || process.env.DB_PASS,
    database: process.env[`${envPrefix}_NAME`] || `${appCode}_db`
  };
  

  // Validate required config
  if (!envConfig.host || !envConfig.username || !envConfig.password) {

    // Fallback: Use predefined database configs from config/database.js
    const dbConfig = require('../config/database');
    const predefinedConfig = dbConfig[appCode];

    if (predefinedConfig) {
      
      return {
        host: predefinedConfig.host,
        port: predefinedConfig.port,
        username: predefinedConfig.username,
        password: predefinedConfig.password,
        database: predefinedConfig.database,
        // MySQL pool options
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    }

    // Final fallback: Use global DB credentials with app-specific database name
    if (process.env.DB_USER && process.env.DB_PASS) {
      return {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env[`${envPrefix}_NAME`] || `${appCode}_db`,
        // MySQL pool options
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    }

    return null;
  }

  
  return {
    host: String(envConfig.host),
    port: Number(envConfig.port),
    username: String(envConfig.username),
    password: String(envConfig.password),
    database: String(envConfig.database),
    // MySQL pool options
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

/**
 * Dynamic App Route Middleware
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
async function dynamicAppRoute(req, res, next) {
  const timestamp = new Date().toLocaleTimeString('id-ID');

  try {
    // 1. Extract appName from URL parameter
    // Supports patterns like: /api/:appName/*, /api/:appName/controller/action
    let appName = req.params.appName || req.params[0];

    // Clean up appName (remove leading/trailing slashes)
    if (appName) {
      appName = appName.replace(/^\/+|\/+$/g, '');
      // If appName contains slashes (e.g., "students/list"), take the first part
      appName = appName.split('/')[0];
    }

    if (!appName) {
      return res.status(400).json({
        success: false,
        message: 'Application name not specified in URL'
      });
    }

    // Check if this is a reserved route (should not be handled by dynamic routing)
    if (isReservedRoute(appName)) {
      return next(); // Skip to next middleware
    }

    
    // Store appName in request for later use
    req.appName = appName;
    req.appType = appName; // For compatibility with existing upload middleware
    
    // 2. Validate app against Master Database (with caching)
    let appData = getCachedApp(appName);
    
    if (!appData) {
      // Fetch from Master Database
      appData = await fetchAppFromMaster(appName);
      
      if (!appData) {
        return res.status(404).json({
          success: false,
          message: `Application '${appName}' not found in Master Database`
        });
      }
      
      // Cache the app data
      setCachedApp(appName, appData);
    } else {
    }
    
    // Store app data in request
    req.appData = appData;
    
    // 3. Get database credentials for the app
    const dbConfig = getAppDatabaseConfig(appName);
    
    if (!dbConfig) {
      return res.status(500).json({
        success: false,
        message: `Database configuration not found for application '${appName}'`
      });
    }
    
    
    // 4. Lazy Loading: Create/retrieve connection pool
    // Pool is created only if it doesn't exist yet
    const pool = await getOrCreatePool(appName, dbConfig);
    
    // 5. Inject database pool into request object
    req.appDb = pool;
    
    // Also provide a helper to execute queries directly
    req.appQuery = async (sql, params = []) => {
      const [rows] = await pool.execute(sql, params);
      return rows;
    };
    
    
    next();
  } catch (error) {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    
    // Handle specific error types
    if (error.code === 'ER_BAD_DB_ERROR') {
      return res.status(503).json({
        success: false,
        message: `Database not found for application '${req.appName || 'unknown'}'`
      });
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(503).json({
        success: false,
        message: `Database access denied for application '${req.appName || 'unknown'}'`
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize application database connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Optional: Middleware factory for specific app types
 * Creates a middleware that only allows specific apps
 * 
 * @param  {...string} allowedApps - List of allowed app codes
 * @returns {Function} - Express middleware
 */
function allowApps(...allowedApps) {
  return async (req, res, next) => {
    await dynamicAppRoute(req, res, (err) => {
      if (err) return next(err);
      
      if (!allowedApps.includes(req.appName)) {
        return res.status(403).json({
          success: false,
          message: `Access denied for application '${req.appName}'`
        });
      }
      
      next();
    });
  };
}

module.exports = dynamicAppRoute;
module.exports.allowApps = allowApps;
module.exports.getCachedApp = getCachedApp;
module.exports.setCachedApp = setCachedApp;
module.exports.CACHE_TTL = CACHE_TTL;
