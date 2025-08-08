import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  // Your Stripe Publishable Key (test or live)
  const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

  // Initialize Stripe.js
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

  const handlePayment = async () => {
    if (!bookingData) {
      alert("No booking data found.");
      return;
    }

    const stripe = await stripePromise;

    try {
      // Call your backend to create a Stripe Checkout session
      // Here assuming your backend endpoint: POST /api/create-checkout-session
      // which accepts bookingData and returns { sessionId }
      const response = await fetch("http://localhost:4000/api/create-checkout-session", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        alert("Failed to create payment session.");
        return;
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  if (!bookingData) {
    return (
      <div className="p-4 text-center text-red-600">
        No booking data found. Please start your booking!
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Payment</h2>
      <p className="mb-4">Amount to pay: ₹{bookingData.totalAmount}</p>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-bold"
      >
        Pay Now with Stripe
      </button>
    </div>
  );
}
