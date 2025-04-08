const mongoose =require('mongoose');

const userSchema =mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    wishlistItems:{
        type:[String],
    },
    cartItems:{
        type:[String],
    }
})

const User= mongoose.model('User',userSchema);

module.exports =User;