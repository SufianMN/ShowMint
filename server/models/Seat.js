const mongoose = require('mongoose');
const { Schema } = mongoose;

const SeatSchema = new Schema({
  seatNumber: { type: String, required: true },
  seatType: { type: String, enum: ['VIP', 'Regular', 'Disabled'], default: 'Regular' },
  priceMultiplier: { type: Number, default: 1 },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Seat', SeatSchema);
