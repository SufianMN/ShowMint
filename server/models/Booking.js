const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
  snacks: [{ type: Schema.Types.ObjectId, ref: 'Snack' }],
  parking: { type: Schema.Types.ObjectId, ref: 'Parking' },
  bookingDate: { type: Date, default: Date.now },
  showDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
});

module.exports = mongoose.model('Booking', BookingSchema);
