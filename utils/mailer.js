const nodemailer = require('nodemailer');

// Set up the transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'edummy142@gmail.com', // Replace with your Gmail address
    pass: 'oxbj kauj njcw gnhg'    // Replace with your Gmail password or App Password
  }
});

// Function to send the verification email
const sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: 'edummy142@gmail.com',  // Sender's email
    to: toEmail,  // Recipient's email
    subject: 'Verify Your Email Address',
    text: `Please click the link below to verify your email address:\n\n${verificationLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = {sendVerificationEmail,transporter}  ;

