const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Existing Register route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const avatarInitials = name.split(' ').map(n => n[0].toUpperCase()).join('');
    const user = new User({ email, passwordHash, name, avatarInitials });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { email, name, avatarInitials } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Existing Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { email: user.email, name: user.name, avatarInitials: user.avatarInitials } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// New Google Login route
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token missing' });

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, sub: googleId, picture } = payload;

    // Find user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user if not found
      const avatarInitials = name.split(' ').map(n => n[0].toUpperCase()).join('');
      user = new User({
        email,
        name,
        googleId,
        avatarInitials,
        avatarUrl: picture, // optional, if you store profile pictures
      });
      await user.save();
    } else if (!user.googleId) {
      // Link existing account by updating googleId if missing
      user.googleId = googleId;
      if (!user.avatarUrl) user.avatarUrl = picture;
      await user.save();
    }

    // Issue JWT token
    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token: jwtToken, user: { email: user.email, name: user.name, avatarInitials: user.avatarInitials, avatarUrl: user.avatarUrl } });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

module.exports = router;
