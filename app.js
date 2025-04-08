const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const sessionStore = require('connect-mongo');
const searchRoute = require('./routes/searchRoute');
const productRoutes =require('./routes/productRoutes');
const wishlistRoutes =require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoute = require('./routes/paymentRoute');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const isAuthenticated = require('./middleware/isAuthenticated');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs'); //setting ejs as a templating engine

const store = sessionStore.create({
    mongoUrl: process.env.URI,
    collectionName : 'sessions',
    ttl : 60*60*24,
})

app.use(session({
    secret : process.env.secret,
    resave : false,
    saveUninitialized : false,
    store : store,
    cookie : {
        httpOnly : true,

        maxAge : 1000*60*60*24,
    },
}))

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store'); //this code prevents browser from storing information as cache
    next();
  });
  

app.use('/user', userRoutes);  
app.use('/products', productRoutes);  
app.use('/wishlist', isAuthenticated,wishlistRoutes);  
app.use('/cart', isAuthenticated,cartRoutes);          
app.use('/search',searchRoute);  
app.use('/payment', isAuthenticated,paymentRoute);  
app.use('/order', isAuthenticated,orderRoutes);
app.use('/admin',isAuthenticated ,adminRoutes);

app.use(express.static('./public')); 

app.get('/',(req,res) => { 
    res.render('home',{ user : req.session.user});
})


app.get('/profile',isAuthenticated,(req,res) => {  
    res.render('profile');
})

const start = async() => {
    await connectDb();
    app.listen(port,() => {
        console.log(`app is listening on port ${port}`);
    })
}

start();

