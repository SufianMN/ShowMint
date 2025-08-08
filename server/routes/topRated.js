const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // Adjust path to your Movie model

// GET /api/top-rated
router.get('/top-rated', async (req, res) => {
  try {
    const topMovies = await Movie.find({})
      .sort({ rating: -1 })  // Sort by rating descending
      .limit(20);            // Limit to top 20 movies

    res.json(topMovies);
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
});

module.exports = router;
