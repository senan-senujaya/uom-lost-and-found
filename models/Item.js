const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  reporterName: { type: String, required: true },
  reporterEmail: { type: String, required: true },
  imageUrl: { type: String },
  secretToken: { type: String } // <-- NEW: The security token!
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);