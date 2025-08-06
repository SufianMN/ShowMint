const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Adjust this path if your model is in a different folder

// GET /api/seats?movieId=xxxx
router.get('/', async (req, res) => {
  const { movieId } = req.query;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId query parameter is required' });
  }
  
  try {
    const seats = await Seat.find({ movieId });
    res.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Server error while fetching seats' });
  }
});

module.exports = router;
