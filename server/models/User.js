const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: function() { return !this.googleId; } }, // required only if no googleId
  name: { type: String, required: true },
  avatarInitials: String,
  avatarUrl: String, // store profile picture URL (Google or other OAuth)
  googleId: { type: String, unique: true, sparse: true }, // sparse allows null values without uniqueness conflict
  memberSince: { type: Date, default: Date.now },
  loyaltyPoints: { type: Number, default: 0 },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  favoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  facebookId: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('User', UserSchema);
