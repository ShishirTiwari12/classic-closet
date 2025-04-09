const express = require('express');
const router = express.Router();
const {verifyEmail,forgotPassword,resetPassword,postResetPassword}= require('../controllers/auth');

router.get('/verify-email',verifyEmail);
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword'); // renders the form
  });
router.post('/forgot-password',forgotPassword);
router.get('/reset-password/:token',resetPassword);
router.post('/reset-password',postResetPassword);
module.exports = router ;