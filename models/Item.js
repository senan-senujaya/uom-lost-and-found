const mongoose = require('mongoose');

// This is the blueprint for our Lost and Found items
const itemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Lost', 'Found'], // It MUST be one of these two words
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  }, // e.g., Wallet, ID Card, Electronics
  location: { 
    type: String, 
    required: true 
  }, // Where on campus it was lost/found
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    default: 'Open' 
  }, // Can be changed to 'Returned' later
  reporterName: { 
    type: String, 
    required: true 
  },
  reporterEmail: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String 
  } // We will use this later when we add photo uploads
});

// Export this blueprint so our server can use it
module.exports = mongoose.model('Item', itemSchema);