const express = require('express');
const router = express.Router();
const RequirementMasterController = require('../controllers/RequirementMasterController');

router.get('/', RequirementMasterController.getAll);
router.get('/:id', RequirementMasterController.getById);
router.post('/', RequirementMasterController.create);
router.put('/:id', RequirementMasterController.update);
router.delete('/:id', RequirementMasterController.delete);

module.exports = router;
