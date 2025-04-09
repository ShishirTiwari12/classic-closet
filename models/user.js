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
    ,
    verified : {
        type: Boolean,
        default:false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: { type: Date },
    createdAt : { type : Date },


})

const User= mongoose.model('User',userSchema);

module.exports =User;