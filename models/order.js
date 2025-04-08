
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userEmail : {
        type : String,
        required : true,
    },
    orderDate : {
        type : String,
        required : true,
    }
    ,
    transactionId :{
        type : String,
        required : true,
    },
    status : {
        type : String,
        required : true,
    },
    products : {
        type : [String],
    },
    totalAmount : {
        type : String,
        required : true,
    }
})

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;