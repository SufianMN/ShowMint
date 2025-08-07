const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Make sure this path is correct

// GET /api/seats?movieId=xxxx
router.get('/', async (req, res) => {
  const { movieId } = req.query;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId query parameter is required' });
  }

  try {
    // Fetch all seats linked to the movieId
    const seats = await Seat.find({ movieId });
    res.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Server error while fetching seats' });
  }
});

// PATCH /api/seats/:id/book
router.patch('/:id/book', async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }
    if (!seat.isAvailable) {
      return res.status(400).json({ error: 'Seat already booked' });
    }

    seat.isAvailable = false;
    await seat.save();

    res.json(seat);
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ error: 'Server error while booking seat' });
  }
});

module.exports = router;
