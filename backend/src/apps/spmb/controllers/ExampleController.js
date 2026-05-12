/**
 * Example Dynamic App Controller
 * 
 * This controller demonstrates how to use the dynamically injected
 * database connection (req.appDb) provided by the dynamicAppRoute middleware.
 * 
 * Features demonstrated:
 * - Using req.appDb pool directly with execute()
 * - Using req.appQuery helper for simpler queries
 * - Transaction support
 * - Error handling
 */

const ExampleController = {
    /**
     * Get all items from the app's database
     * Uses direct pool connection with execute()
     */
    async getAll(req, res) {
        try {
            // req.appDb is the MySQL connection pool for this specific app
            // The pool was lazily created by dynamicAppRoute middleware
            const [rows] = await req.appDb.execute('SELECT * FROM items ORDER BY created_at DESC');
            
            return res.json({
                success: true,
                data: rows,
                appName: req.appName,
                appData: req.appData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch items',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Get single item by ID
     * Uses parameterized queries to prevent SQL injection
     */
    async getOne(req, res) {
        try {
            const { id } = req.params;
            
            // Using req.appQuery helper for simpler syntax
            const rows = await req.appQuery(
                'SELECT * FROM items WHERE id = ?',
                [id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }
            
            return res.json({
                success: true,
                data: rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch item',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Create new item
     * Demonstrates INSERT with returned ID
     */
    async create(req, res) {
        try {
            const { name, description, value } = req.body;
            
            // Validate required fields
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required'
                });
            }
            
            // INSERT query
            const [result] = await req.appDb.execute(
                'INSERT INTO items (name, description, value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [name, description || null, value || 0]
            );
            
            // Get the inserted item
            const [newItem] = await req.appDb.execute(
                'SELECT * FROM items WHERE id = ?',
                [result.insertId]
            );
            
            return res.status(201).json({
                success: true,
                message: 'Item created successfully',
                data: newItem[0]
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create item',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Update existing item
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, value } = req.body;
            
            // Check if item exists
            const [existing] = await req.appDb.execute(
                'SELECT * FROM items WHERE id = ?',
                [id]
            );
            
            if (existing.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }
            
            // UPDATE query
            await req.appDb.execute(
                `UPDATE items 
                 SET name = ?, description = ?, value = ?, updated_at = NOW() 
                 WHERE id = ?`,
                [name, description, value, id]
            );
            
            // Get updated item
            const [updated] = await req.appDb.execute(
                'SELECT * FROM items WHERE id = ?',
                [id]
            );
            
            return res.json({
                success: true,
                message: 'Item updated successfully',
                data: updated[0]
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update item',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Delete item
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            // DELETE query
            const [result] = await req.appDb.execute(
                'DELETE FROM items WHERE id = ?',
                [id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }
            
            return res.json({
                success: true,
                message: 'Item deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete item',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Example with transaction support
     * Demonstrates atomic operations
     */
    async bulkCreate(req, res) {
        let connection;
        
        try {
            const { items } = req.body;
            
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Items array is required and cannot be empty'
                });
            }
            
            // Get a dedicated connection from the pool for transaction
            connection = await req.appDb.getConnection();
            
            // Start transaction
            await connection.beginTransaction();
            
            try {
                const insertedIds = [];
                
                for (const item of items) {
                    const [result] = await connection.execute(
                        'INSERT INTO items (name, description, value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                        [item.name, item.description || null, item.value || 0]
                    );
                    insertedIds.push(result.insertId);
                }
                
                // Commit transaction
                await connection.commit();
                
                return res.status(201).json({
                    success: true,
                    message: `Successfully created ${items.length} items`,
                    data: { insertedIds, count: items.length }
                });
            } catch (transactionError) {
                // Rollback on error
                await connection.rollback();
                throw transactionError;
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create items in bulk',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } finally {
            // Release connection back to pool
            if (connection) {
                connection.release();
            }
        }
    },

    /**
     * Health check for app database
     */
    async healthCheck(req, res) {
        try {
            const startTime = Date.now();
            
            // Test connection
            await req.appDb.execute('SELECT 1');
            
            const responseTime = Date.now() - startTime;
            
            return res.json({
                success: true,
                appName: req.appName,
                appData: req.appData,
                database: {
                    status: 'connected',
                    responseTime: `${responseTime}ms`,
                    poolStats: {
                        totalConnections: req.appDb._pool._allConnections.length,
                        freeConnections: req.appDb._pool._freeConnections.length,
                        activeConnections: req.appDb._pool._allConnections.length - req.appDb._pool._freeConnections.length
                    }
                }
            });
        } catch (error) {
            return res.status(503).json({
                success: false,
                message: 'Database health check failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = ExampleController;
