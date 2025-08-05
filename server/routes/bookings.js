const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('movie seats snacks parking');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movie, seats, snacks, parking, showDate, totalAmount } = req.body;
    const booking = new Booking({
      user: req.userId,
      movie, seats, snacks, parking, showDate, totalAmount, status: 'Pending'
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

module.exports = router;
