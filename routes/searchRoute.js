const express = require('express');
const router = express.Router();
const searchProducts = require('../controllers/search');

router.get('/',searchProducts);

module.exports = router;