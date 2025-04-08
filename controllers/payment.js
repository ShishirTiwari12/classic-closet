const crypto = require('crypto');
const Product = require('../models/product');
const Order = require('../models/order');

let products=[];

const payment = async (req,res) =>{
    // const id = req.params.id;
    // productId = id;
    const productIds = req.body.productIds;
    let  amount=0;
    try{
    // const product = await Product.findById(id);
    for(let x of productIds){
        products.push(x);
        const product = await Product.findById(x);
        amount+=product.price;
    }
    // amount = product.price;
    }
    catch(err){
        console.log(err);
    }
    const transactionUUID = generateTransactionUUID(); 
    const taxAmount = 0;
    const totalAmount = amount + taxAmount;
    const productCode = "EPAYTEST";

    const secretKey = "8gBm/:&EnhH.1/q"; // Replace with your actual secret key
    const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;
    const signature = crypto.createHmac("sha256", secretKey).update(signatureString).digest("base64");
    initialSignature = signature;

    res.send(`
        <html>
        <head>
        <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .payment-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            padding: 30px;
            text-align: center;
        }
        .logo-container {
            margin-bottom: 20px;
        }
        .logo {
            width: 120px;
            height: 40px;
            background-color: #60BB46; /* eSewa green color */
            border-radius: 5px;
            color: white;
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 25px;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 30px;
        }
        .pay-button {
            background-color: #60BB46; /* eSewa green color */
            color: white;
            border: none;
            padding: 14px 30px;
            font-size: 16px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s, transform 0.2s;
            width: 80%;
            max-width: 250px;
            display: inline-block;
            text-decoration: none;
        }
        .pay-button:hover {
            background-color: #53a53c;
            transform: translateY(-2px);
        }
        .order-info {
            font-size: 14px;
            color: #777;
            margin-top: 25px;
        }
    </style>
    </head>
        <body >
            <div class="payment-container">
        <div class="logo-container">
            <div class="logo">eSewa</div>
        </div>
        <h1>Complete Your Payment</h1>
        <div class="amount">Rs.${totalAmount}</div>
            <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                <input type="hidden" name="amount" value="${amount}">
                <input type="hidden" name="tax_amount" value="${taxAmount}">
                <input type="hidden" name="total_amount" value="${totalAmount}">
                <input type="hidden" name="transaction_uuid" value="${transactionUUID}">
                <input type="hidden" name="product_code" value="${productCode}">
                <input type="hidden" name="product_service_charge" value="0">
                <input type="hidden" name="product_delivery_charge" value="0">
                <input type="hidden" name="success_url" value="http://localhost:3000/payment/landing/success">
                <input type="hidden" name="failure_url" value="http://localhost:3000/payment/landing/failed">
                <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code">
                <input type="hidden" name="signature" value="${signature}">
                <button type="submit" class="pay-button">Pay via esewa</button>
                        <div class="order-info">Order #12345 • ClassicCloset</div>
    </div>
            </form>
        </body>
        <script>

        </script>
        </html>
    `);


}

function generateTransactionUUID() {
    return 'tranc' + crypto.randomUUID(); // Generates a unique transaction ID
}

const paymentSuccess = async (req,res) =>{
    const date = new Date(Date.now());
    const isoDate = date.toISOString();
    const formattedDate = isoDate.split('T')[0];

    const data = req.query.data;
    const decodedData = Buffer.from(data,'base64').toString('utf-8');
    const jsonData = JSON.parse(decodedData);
    await Order.create({userEmail : req.session.user.email, orderDate : formattedDate ,transactionId : jsonData.transaction_code,status : 'processing' , totalAmount : jsonData.total_amount, products : products});
    return res.render('successfulPayment');
}

const paymentFailed = (req,res) =>{
    res.render('paymentFailed');
}

module.exports =  {payment,paymentSuccess,paymentFailed};