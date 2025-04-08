const express =require('express');
const router =express.Router();

const {getProducts,getAProduct} =require('../controllers/product');

router.get('/',getProducts);
router.get('/:id',getAProduct);

module.exports =router;