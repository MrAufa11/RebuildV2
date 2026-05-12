const express = require('express');
const router = express.Router();

router.use('/registrants', require('./registrants'));
router.use('/payments', require('./payments'));

module.exports = router;
