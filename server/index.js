require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// Removed 'node-fetch' import since Facebook code is removed
const { OAuth2Client } = require('google-auth-library');
const passport = require('passport'); // Optional if using passport strategies (can remove if not needed)
 
// Existing route imports
const seatsRouter = require('./routes/seats');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');
const snackRoutes = require('./routes/snacks');
const parkingRoutes = require('./routes/parking');
const topRatedRoutes = require('./routes/topRated');
const paymentRoutes = require('./routes/payment');


const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize passport (optional)
app.use(passport.initialize());

// Instantiate Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login route
app.post('/api/auth/google-login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Google token missing' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;

    // TODO: Your user find/create and JWT generation logic here

    return res.json({
      message: 'Google login successful',
      user: { email, name, picture, googleId },
      // token: generatedAuthToken
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Attach existing main routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/snacks', snackRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/seats', seatsRouter);
app.use('/api', topRatedRoutes);
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
