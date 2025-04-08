const Product = require('../models/product');

const searchProducts = async (req,res) =>{
    try {
        let query = req.query.q || "";
        let words = query.trim().split(/\s+/); // .split returns the array of words 

        // query to search products
        let searchConditions = words.flatMap(word => ([
            { productName: { $regex: word, $options: "i" } },
            { category: { $regex: word, $options: "i" } },
            { targetAudience: { $regex: word, $options: "i" } }
        ]));

        let products = await Product.find({ $or: searchConditions });
        return res.render('search',{ user : req.session.user , products : products});
    }
    catch(err){
        console.log(err);
        return res.status(500).send("error occured while searching products");
    }
}

module.exports = searchProducts;
