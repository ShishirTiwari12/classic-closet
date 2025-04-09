const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the User model
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,  // Automatically set the creation time
    expires: 600 // Token expires after 600 seconds (10 minutes)
  }
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
