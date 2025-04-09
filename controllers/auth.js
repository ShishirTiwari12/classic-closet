
const VerificationToken = require('../models/verificationToken');
const User = require('../models/user');
const crypto = require('crypto');
const {transporter} = require('../utils/mailer');

    const verifyEmail = async (req, res) => {
        const { token } = req.query; // Get the token from the query string
  
        if (!token) {
            return res.status(400).send('Invalid token!');
        }
  
        try {
        // Find the token in the database
        const verificationToken = await VerificationToken.findOne({ token });
  
        if (!verificationToken) {
            return res.status(400).send('Invalid or expired token!');
        }
  
        // Check if the token has expired
        const tokenAge = Date.now() - verificationToken.createdAt;
        const expirationTime = 600000; // 10 minutes in milliseconds
        if (tokenAge > expirationTime) {
            return res.status(400).send('Token has expired!');
        }
  
        // Mark the user as verified in the User model
        const user = await User.findById(verificationToken.userId);
        user.verified = true;
        await user.save();
  
        // Delete the verification token after successful verification
        await VerificationToken.deleteOne({ token });
  
        res.redirect('/auth.html');
    } catch (error) {
        res.status(500).send('Something went wrong!');
        }
    }  




    const forgotPassword    = async (req, res) => {
    const { email } = req.body;

    try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.send('No account with that email found.');
    }

    // 2. Generate reset token
    const token = crypto.randomBytes(32).toString('hex');

    // 3. Set token and expiry on user object
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const resetLink = `http://localhost:3000/auth/reset-password/${token}`;

    const mailOptions1 = {
    to: user.email,
    from: process.env.EMAIL,
    subject: 'Password Reset Request',
    html: `
    <p>You requested a password reset.</p>
    <p>Click the link below to set a new password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 1 hour.</p>
    `,
    };

    await transporter.sendMail(mailOptions1);



    // 4. Next: Send an email with this reset token as a URL link
    // We'll handle that in Step 4.

    res.send('Password reset link has been sent to your email.');

    } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
    }
    }






const resetPassword = async (req, res) => {
    const { token } = req.params;
    console.log(token);
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }  // Check if the token is still valid
    });
        
      console.log(user);
  
      if (!user) {
        return res.send('Invalid or expired password reset token.');
      }
  
      res.render('resetpassword', { token }); // render form with hidden token
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };


    const postResetPassword = async (req, res) => {
    const { token, password } = req.body;
    
  
    try {
      // 1. Find the user with this reset token and make sure it's not expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }  // Check if the token is still valid
    });
    
      console.log(user);
      if (!user) {
        return res.send('Invalid or expired token.');
      }
  

  
      // 3. Update password and clear reset fields
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.render('succesfullResetOfPassword');
      // Optionally: redirect to login page or log the user in automatically
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong.');
    }
  };
  
  



  module.exports = {verifyEmail,forgotPassword,resetPassword,postResetPassword};