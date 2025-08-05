const mongoose = require('mongoose');
const { Schema } = mongoose;

const SnackSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: String,
  category: { type: String, enum: ['appetizer', 'chaat', 'beverage', 'main', 'snack'], default: 'snack' },
  mostOrdered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Snack', SnackSchema);
