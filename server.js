const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load the hidden variables from our .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware (Tools that run automatically)
app.use(cors()); // Allows our future React frontend to talk to this backend
app.use(express.json()); // Allows the server to understand JSON data (like form submissions)

// Import and use our item routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// A simple test route to make sure the server is awake
app.get('/', (req, res) => {
  res.send('Welcome to the UoM Lost and Found API!');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on port ${PORT}`);
});