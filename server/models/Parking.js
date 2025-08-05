const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParkingSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  type: { type: String, enum: ['regular', 'valet', 'premium'], default: 'regular' }
});

module.exports = mongoose.model('Parking', ParkingSchema);
