const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import our blueprint

// Door 1: GET all items (Used for the feed page)
router.get('/', async (req, res) => {
  try {
    // Fetch all items from the database, sorted by newest first
    const items = await Item.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Door 2: POST a new item
router.post('/', async (req, res) => {
  // Generate a random 6-character uppercase token (e.g., "A7F9B2")
  const generatedToken = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newItem = new Item({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category,
    location: req.body.location,
    reporterName: req.body.reporterName,
    reporterEmail: req.body.reporterEmail,
    imageUrl: req.body.imageUrl,
    secretToken: generatedToken // <-- Assign the token here
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // This sends the item (and the token) back to the frontend
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Door 3: DELETE an item (When it's returned to the owner)
// Door 3: DELETE an item securely (With Admin Bypass)
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // --- YOUR MASTER PASSWORD ---
    const MASTER_PASSWORD = "ADMIN"; // You can change this to whatever you want!
    const providedToken = req.body.token;

    // Check if the user provided EITHER the exact secret token OR the master password
    if (item.secretToken && providedToken !== item.secretToken && providedToken !== MASTER_PASSWORD) {
      return res.status(403).json({ message: 'Incorrect Secret Token or Admin Password! Access Denied.' });
    }

    // If we pass the security check, delete the item
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item resolved and removed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;