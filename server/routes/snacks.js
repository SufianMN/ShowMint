const express = require('express');
const router = express.Router();
const Snack = require('../models/Snack');

router.get('/', async (req, res) => {
  try {
    const snacks = await Snack.find({});
    res.json(snacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snacks' });
  }
});

module.exports = router;
