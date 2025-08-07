const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParkingSchema = new Schema({
  price: { type: Number, required: true },
  description: String,
  type: { type: String, default: 'regular' }
});


module.exports = mongoose.model('Parking', ParkingSchema);
