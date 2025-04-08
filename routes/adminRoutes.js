const express = require('express');
const router = express.Router();
const upload = require('../config/storage');
const {getProducts,addProducts,deleteProduct,updateProduct} = require('../controllers/admin');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/',getProducts);
router.get('/add', async (req,res) =>{
    return res.render('adminAdd',{user:{username:'admin'}});
})
router.post('/add',upload.single('image'), addProducts);
router.delete('/delete/:id',deleteProduct);

router.post('/update/:id', upload.single('image'), updateProduct);
router.get('/update/:id',(req,res) => {
    return res.render('adminUpdate',{productId : req.params.id});
})
  

module.exports = router;