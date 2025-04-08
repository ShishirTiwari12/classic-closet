const express = require('express');
const router = express.Router();
const {payment,paymentSuccess,paymentFailed}= require('../controllers/payment');


router.post('/',payment);
router.get('/landing/success',paymentSuccess);
router.get('/landing/failed',paymentFailed);

module.exports = router;