const express = require('express');
const router = express.Router();
const RolePermissionController = require('../controllers/RolePermissionController');

// Assign or Update Permission
router.post('/assign', RolePermissionController.assignPermission);

// Get Permissions by Role ID
router.get('/:role_id', RolePermissionController.getByRole);

module.exports = router;
