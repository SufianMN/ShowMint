const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Adjust path if needed

// GET /api/seats?movieId=xxxx
// Fetch all seats linked to a specific movie
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

// POST /api/seats/bulk
// Fetch multiple seat details by an array of seat IDs (used for showing booked seats details)
router.post('/bulk', async (req, res) => {
  const { seatIds } = req.body;

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ error: 'seatIds must be a non-empty array' });
  }

  try {
    const seats = await Seat.find({ _id: { $in: seatIds } });
    res.json(seats);
  } catch (error) {
    console.error('Error fetching bulk seats:', error);
    res.status(500).json({ error: 'Server error while fetching seats' });
  }
});

// PATCH /api/seats/:id/book
// Mark a seat as booked (isAvailable = false)
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
