const express = require('express');
const router = express.Router();
const getOrders = require('../controllers/order');

router.get('/',getOrders);

module.exports = router;