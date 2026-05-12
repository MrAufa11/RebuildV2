/**
 * App Database Pool Manager
 * 
 * Manages lazy-loaded MySQL connection pools for different applications.
 * Uses mysql2/promise for connection pooling with automatic pooling management.
 * 
 * Features:
 * - Lazy Loading: Creates pools only when first requested
 * - In-Memory Cache: Stores created pools in memory
 * - Pool Health Check: Validates pool before returning
 * - Graceful Shutdown: Closes all pools on application exit
 */

const mysql = require('mysql2/promise');

// In-memory pool cache
const poolCache = new Map();

// Pool configuration defaults
const DEFAULT_POOL_CONFIG = {
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

/**
 * Get or create a database connection pool for an application
 * 
 * @param {string} appName - The application identifier
 * @param {object} dbConfig - Database configuration object
 * @returns {Promise<mysql.Pool>} - MySQL connection pool
 */
async function getOrCreatePool(appName, dbConfig) {
  const timestamp = new Date().toLocaleTimeString('id-ID');

  // Check if pool already exists in cache
  if (poolCache.has(appName)) {
    const cachedPool = poolCache.get(appName);

    // Optional: Health check for cached pool
    try {
      await cachedPool.query('SELECT 1');
      return cachedPool;
    } catch (error) {
      // Pool is unhealthy, remove from cache and create new one
      await cachedPool.end().catch(() => { }); // Gracefully close old pool
      poolCache.delete(appName);
    }
  }

  // Create new pool

  const poolConfig = {
    ...DEFAULT_POOL_CONFIG,
    ...dbConfig,
    user: dbConfig.user || dbConfig.username
  };

  const pool = mysql.createPool(poolConfig);

  // Test the connection
  try {
    await pool.query('SELECT 1');

    // Cache the pool
    poolCache.set(appName, pool);

    return pool;
  } catch (error) {
    await pool.end().catch(() => { }); // Clean up failed pool
    throw error;
  }
}

/**
 * Get a pool from cache without creating a new one
 * 
 * @param {string} appName - The application identifier
 * @returns {mysql.Pool|null} - MySQL connection pool or null if not exists
 */
function getPoolFromCache(appName) {
  return poolCache.get(appName) || null;
}

/**
 * Check if a pool exists for an application
 * 
 * @param {string} appName - The application identifier
 * @returns {boolean} - True if pool exists
 */
function hasPool(appName) {
  return poolCache.has(appName);
}

/**
 * Remove a pool from cache and close it
 * 
 * @param {string} appName - The application identifier
 * @returns {Promise<boolean>} - True if pool was removed
 */
async function removePool(appName) {
  const pool = poolCache.get(appName);
  if (pool) {
    await pool.end();
    poolCache.delete(appName);
    return true;
  }
  return false;
}

/**
 * Close all database pools (for graceful shutdown)
 * 
 * @returns {Promise<void>}
 */
async function closeAllPools() {
  const timestamp = new Date().toLocaleTimeString('id-ID');

  if (poolCache.size === 0) {
    return;
  }

  const closePromises = Array.from(poolCache.entries()).map(async ([appName, pool]) => {
    try {
      await pool.end();
    } catch (error) {
    }
  });

  await Promise.all(closePromises);
  poolCache.clear();
}

/**
 * Get pool cache statistics
 * 
 * @returns {object} - Pool cache statistics
 */
function getPoolStats() {
  return {
    totalPools: poolCache.size,
    apps: Array.from(poolCache.keys())
  };
}

module.exports = {
  getOrCreatePool,
  getPoolFromCache,
  hasPool,
  removePool,
  closeAllPools,
  getPoolStats
};
