/**
 * Dynamic App Routes
 * 
 * This route file demonstrates how to set up routes that work with
 * the dynamic app routing middleware. These routes will be used with
 * any validated app that passes through the dynamicAppRoute middleware.
 * 
 * URL Pattern: /api/:appName/items/*
 * 
 * Examples:
 * - GET    /api/spmb/items       - Get all items from SPMB database
 * - GET    /api/keuangan/items/1 - Get item from Keuangan database
 * - POST   /api/spmb/items       - Create item in SPMB database
 * - PUT    /api/keuangan/items/1 - Update item in Keuangan database
 * - DELETE /api/spmb/items/1     - Delete item from SPMB database
 */

const express = require('express');
const router = express.Router();
const ExampleController = require('../controllers/ExampleController');

// All routes under /api/:appName/items/* will use the app-specific database
// injected by the dynamicAppRoute middleware (req.appDb)

/**
 * @route   GET /api/:appName/items
 * @desc    Get all items from app's database
 * @access  Public
 */
router.get('/', ExampleController.getAll);

/**
 * @route   GET /api/:appName/items/health
 * @desc    Health check for app's database connection
 * @access  Public
 */
router.get('/health', ExampleController.healthCheck);

/**
 * @route   POST /api/:appName/items/bulk
 * @desc    Create multiple items in a transaction
 * @access  Public
 */
router.post('/bulk', ExampleController.bulkCreate);

/**
 * @route   GET /api/:appName/items/:id
 * @desc    Get single item by ID
 * @access  Public
 */
router.get('/:id', ExampleController.getOne);

/**
 * @route   PUT /api/:appName/items/:id
 * @desc    Update item by ID
 * @access  Public
 */
router.put('/:id', ExampleController.update);

/**
 * @route   DELETE /api/:appName/items/:id
 * @desc    Delete item by ID
 * @access  Public
 */
router.delete('/:id', ExampleController.delete);

/**
 * @route   POST /api/:appName/items
 * @desc    Create new item
 * @access  Public
 */
router.post('/', ExampleController.create);

module.exports = router;
