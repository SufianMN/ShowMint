const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatarInitials: String,
  memberSince: { type: Date, default: Date.now },
  loyaltyPoints: { type: Number, default: 0 },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  favoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

module.exports = mongoose.model('User', UserSchema);
