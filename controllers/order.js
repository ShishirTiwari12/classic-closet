const Order = require('../models/order');
const Product = require('../models/product');

const getOrders = async (req,res) => {
    const email = req.session.user.email;
    let ArrayOfOrders = [];
    let products = [];

    try{
        const orders = await Order.find({userEmail : email}); 
        console.log(orders);//gives the array of order documents with userEmail = email
        for(let x of orders ){
            productIds= x.products;
            for(let y of productIds){

                    const product = await Product.findById(y);
                    if(product){
                        const {productName,price } = product;
                        products.push({productName,price});
                    }
                
            }

            ArrayOfOrders.push({
                orderDate : x.orderDate,
                products : products,
                status : x.status,
                totalAmount : x.totalAmount,
            });
            products = [];
        }
        return res.render('order',{user : req.session.user, orders : ArrayOfOrders});
    }
    catch(err){
        console.log(err);
    }
}

module.exports = getOrders;