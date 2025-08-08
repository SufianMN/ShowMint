const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { totalAmount, seats, selectedSnacks, selectedParking } = req.body;

    const clientUrl = process.env.CLIENT_URL; // read from .env

    // Stripe amount is in paise (for INR)
    const amountInPaise = Math.round(totalAmount * 100);

    // Create line items for checkout:
    // Here we bundle everything as one item, customize as needed
    const line_items = [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Movie Tickets & Add-ons',
            description: `Seats: ${seats.join(', ')}`
          },
          unit_amount: amountInPaise,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${clientUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/booking-summary`,
      metadata: {
        seats: JSON.stringify(seats),
        selectedSnacks: JSON.stringify(selectedSnacks || {}),
        selectedParking: selectedParking || '',
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
