const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  genres: [String],
  rating: Number,
  duration: String,
  year: Number,
  language: String,
  director: String,
  cast: [String],
  posterUrl: String,
  trailerUrl: String,
  featured: { type: Boolean, default: false },
  topRated: { type: Boolean, default: false },
  status: { type: String, enum: ['now-showing', 'upcoming'], default: 'now-showing' }
});

module.exports = mongoose.model('Movie', MovieSchema);
