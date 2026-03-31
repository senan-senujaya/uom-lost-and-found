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
  const newItem = new Item({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category,
    location: req.body.location,
    reporterName: req.body.reporterName,
    reporterEmail: req.body.reporterEmail,
    imageUrl: req.body.imageUrl // <-- ADD THIS LINE HERE!
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Door 3: DELETE an item (When it's returned to the owner)
router.delete('/:id', async (req, res) => {
  try {
    // Find the item by its unique ID and remove it from the database
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item resolved and removed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;