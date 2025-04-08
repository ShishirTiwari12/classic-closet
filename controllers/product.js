const Product =require('../models/product');

const getProducts = async (req,res) =>{
    const {targetAudience,category}=req.query;
    let products;
    try{
    products = await Product.find({targetAudience:targetAudience,category:category}).exec();
    return  res.render('products',{user:req.session.user,products:products});
    }
    catch(err){
        console.log("error filtering products based on targetAudience and category");
        return res.status(500).send("error occured while fetching products ");
    }
}

const getAProduct = async (req,res)=>{
    const {id}=req.params  ;
    let product;
    try{
        product=await Product.findById(id);
        return res.render('product',{user:req.session.user,product:product});
    }
    catch(err){
        return res.status(500).send("error occured while fetching the prodcut");
    }

}


module.exports= {getProducts,getAProduct};