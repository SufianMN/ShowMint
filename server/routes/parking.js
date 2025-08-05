const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');

router.get('/', async (req, res) => {
  try {
    const parkingOptions = await Parking.find({});
    res.json(parkingOptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parking options' });
  }
});

module.exports = router;
