const User = require('../models/user');
const Product =require('../models/product');
const mongoose = require('mongoose');

const getItems = async (req,res) => {
    let total=0;
    let productsIds;
    let products =[];
    if(!req.session.user){
        return res.send("you have to login for using this feature");
    }

    try{
     productsIds =await User.findOne({email:req.session.user.email}).select('cartItems').lean();
     for(let x of productsIds.cartItems){
        const newProduct = await Product.findById(x);
        products.push(newProduct);
     }

    products.forEach(x =>{
        total+=x.price;
    })
    return res.render('cart',{user:req.session.user,products:products,totalAmount:total});
    }
    catch(err){
        return res.send("error occured while fetching wishlist items");
    }
}

const addItem = async (req,res) => {
     /*
    to do :
    1.take id from route parameter
    2.check whether that id already exists or not
    3.add that id to cart  field of user collection
    4.in response send a message of succesfull additon
    */

    const {id}=req.params;

    try{
        const user =await User.findOne({email:req.session.user.email}).select('cartItems');
        if(user.cartItems.includes(new mongoose.Types.ObjectId(id))){
            return res.send({message : "product is already added to wihslist"});
        }
        else{
            user.cartItems.push(new mongoose.Types.ObjectId(id));
        }
        await user.save();
        return res.json({message:"successful"});
    }
    catch(err){
        console.log(err);
        return res.json({message:"failed"});
    }
}

const removeItem= async(req,res)=>{
    
    /* 
        1.get the id from req.params
        2.remove the id from cartItems
        3.save the updates to database
    */

    const {id}=req.params;
    try{
        const user =await User.findOne({email:req.session.user.email}).select('cartItems');
        const index =user.cartItems.indexOf(new mongoose.Types.ObjectId(id));
        user.cartItems.splice(index,1);//removing the element from array
        await user.save();
        return res.json({message:"successful"});
    }
    catch(err){
        console.log(err);
        return res.json({message:"failed"});

    }
}

module.exports = {getItems,addItem,removeItem};