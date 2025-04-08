const express = require('express');
const router = express.Router();
const {getItems,addItem,removeItem} = require('../controllers/cart');

router.get('/',getItems);
router.get('/add/:id',addItem);
router.get('/remove/:id',removeItem);

module.exports = router;