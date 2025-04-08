const mongoose= require('mongoose');
const productSchema = mongoose.Schema({
    productName: {
        type : String,
        required: true,
    },
    description :{
        type:String,
        required :true,
    },
    price : {
        type: Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    imageurl :{
        type:String,
        required:true,
    },
    targetAudience :{
        type:String,
        required:true,
    },
    imagePublicId : {
        type : String,
    }
})

const Product= mongoose.model('products',productSchema);
module.exports = Product;