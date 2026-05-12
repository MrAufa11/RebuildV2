const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

router.post('/', MenuController.create);
router.post('/reorder', MenuController.reorder);
router.get('/', MenuController.getAll);
router.get('/:id', MenuController.getOne);
router.put('/:id', MenuController.update);
router.delete('/:id', MenuController.delete);

module.exports = router;
