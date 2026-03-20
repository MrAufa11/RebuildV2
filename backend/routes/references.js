const express = require('express');
const router = express.Router();
const ReferenceController = require('../controllers/ReferenceController');

// All endpoints rely on verifyToken from the caller router (index.js) since they are admin restricted
router.get('/', ReferenceController.getTables);
router.get('/:table/columns', ReferenceController.getColumns);
router.get('/:table/row/:id', ReferenceController.getRow);
router.get('/:table', ReferenceController.getTableData);
router.post('/:table', ReferenceController.createRow);
router.put('/:table/:id', ReferenceController.updateRow);
router.delete('/:table/:id', ReferenceController.deleteRow);

module.exports = router;
