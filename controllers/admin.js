 
const Product = require('../models/product');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user');
const Order = require('../models/order');

const getProducts = async (req,res) =>{
  let products;
  try{
  products = await Product.find({}).exec();
  return  res.render('adminDashboard',{user:{username:'admin'},products:products});
  }
  catch(err){
      console.log("error fetching  products");
      return res.status(500).send("error occured while fetching products ");
  }
}

 const addProducts = async (req, res) => {
  try {
    const { productName,description, price, category, targetAudience } = req.body;

    // req.file contains info about the uploaded image
    const imageurl = req.file.path;           // Cloudinary image URL
    const imagePublicId = req.file.filename;  // Cloudinary public_id

    console.log(imageurl);
    console.log(imagePublicId);

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      targetAudience,
      imageurl,
      imagePublicId,
    });

    await newProduct.save();

    // res.status(201).json({ message: 'Product added successfully', product: newProduct });
    return res.redirect('/admin');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteProduct = async (req,res) => {
  try {
    const productId = req.params.id;

    // Find the product to get imagePublicId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(product.imagePublicId);

    // Delete product from database
    await Product.findByIdAndDelete(productId);

    //deleting productIds from all user documents
    await User.updateMany(
      {},
      {
        $pull: {
          wishlistItems: productId,
          cartItems: productId,
        },
      }
    );

    //deletigng productIds from all order documents 
    await Order.updateMany(
      {},
      {
        $pull : {
          products : productId,
        }
      }
    )

    res.json({ message : " product deleted successfully"});
    
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Something went wrong while deleting the product' });
  }
}

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { productName, price, category, description, targetAudience } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });


    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      // Update image URL and public ID
      product.imageurl = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    product.productName = productName;
    product.price = price;
    product.category = category;
    product.description = description;
    product.targetAudience = targetAudience;

    await product.save();

    return res.redirect('/admin');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Something went wrong while updating the product' });
  }
}



module.exports = {getProducts,addProducts,deleteProduct,updateProduct};