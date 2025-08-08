import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
// Removed unused Link import and ProceedToCheckoutButton component import

export default function SnacksParking() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract movieId and selected seats (IDs) from route state
  const { movieId, seats: bookedSeatIds } = location.state || {};

  const [snacks, setSnacks] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSnacks, setSelectedSnacks] = useState({});
  // Removed parking state as parking is on a different page now

  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available snacks
  useEffect(() => {
    api.get("/snacks")
      .then((res) => setSnacks(res.data))
      .catch(() => {
        /* handle errors if needed */
      });
  }, []);

  // Fetch detailed seat info for bookedSeatIds
  useEffect(() => {
    if (!bookedSeatIds || bookedSeatIds.length === 0) {
      setLoadingSeats(false);
      return;
    }

    api.post("/seats/bulk", { seatIds: bookedSeatIds })
      .then((res) => {
        setBookedSeats(res.data);
        setLoadingSeats(false);
      })
      .catch((err) => {
        console.error("Failed to fetch seat details", err);
        setError("Failed to load booked seat details");
        setLoadingSeats(false);
      });
  }, [bookedSeatIds]);

  // Calculate total amount: seats + snacks
  useEffect(() => {
    const BASE_PRICE = 100;
    const seatsTotal = bookedSeats.reduce(
      (sum, seat) => sum + BASE_PRICE * (seat.priceMultiplier || 1),
      0
    );

    const snacksTotal = Object.entries(selectedSnacks).reduce((sum, [snackId, qty]) => {
      const snack = snacks.find((s) => s._id === snackId);
      return sum + (snack ? snack.price * qty : 0);
    }, 0);

    setTotalAmount(seatsTotal + snacksTotal);
  }, [bookedSeats, selectedSnacks, snacks]);

  // Increase/decrease snack quantity
  const updateSnackQuantity = (snackId, delta) => {
    setSelectedSnacks((prev) => {
      const newQty = (prev[snackId] || 0) + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: newQty };
    });
  };

  // Handle Confirm & proceed to parking page where user selects parking
  // Pass movieId, seats, snacks selections to parking page via state
  const handleConfirmAndProceed = () => {
    navigate("/parking", {
      state: {
        movieId,
        seats: bookedSeatIds,
        selectedSnacks,
      },
    });
  };

  // New: Proceed to Booking Summary directly without snacks or parking
  const handleProceedToCheckout = () => {
    navigate("/booking-summary", {
      state: {
        movieId,
        seats: bookedSeatIds,
        selectedSnacks,
        selectedParking: null, // explicitly no parking selected here
      },
    });
  };

  if (loadingSeats) {
    return <div className="p-4 text-center">Loading your booked seats...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6 pb-10">
      <h2 className="text-3xl font-bold mb-6 text-black">Snacks</h2>

      {/* Booked Seats & Total Amount */}
      <div className="mb-8 p-4 bg-purple-100 rounded shadow flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-purple-800">Your Booked Seats:</h3>
          <div className="flex flex-wrap gap-3">
            {bookedSeats.length > 0 ? (
              bookedSeats.map((seat) => (
                <div
                  key={seat._id}
                  className="px-3 py-1 rounded bg-purple-600 text-white font-medium select-none"
                >
                  {seat.row || ""}
                  {seat.seatNumber}
                </div>
              ))
            ) : (
              <p className="text-purple-700">No seat information available.</p>
            )}
          </div>
        </div>

        <div className="text-lg font-bold text-purple-800 select-none">Total: ₹{totalAmount}</div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-purple-700 underline hover:text-purple-900"
        aria-label="Back to seat selection"
      >
        &larr; Back to Seat Selection
      </button>

      {/* Snacks Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {snacks.map((snack) => (
          <div
            key={snack._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
          >
            <img
              src={snack.image || "https://via.placeholder.com/200x150?text=No+Image"}
              alt={snack.name}
              className="rounded-lg mb-2 object-cover w-full h-40"
            />
            <h4 className="font-semibold">{snack.name}</h4>
            <p className="text-purple-700 font-bold">₹{snack.price}</p>
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => updateSnackQuantity(snack._id, -1)}
                className="bg-purple-600 text-white rounded px-2 py-1 disabled:opacity-50"
                disabled={!selectedSnacks[snack._id]}
                aria-label={`Decrease quantity of ${snack.name}`}
              >
                -
              </button>
              <span>{selectedSnacks[snack._id] || 0}</span>
              <button
                onClick={() => updateSnackQuantity(snack._id, 1)}
                className="bg-purple-600 text-white rounded px-2 py-1"
                aria-label={`Increase quantity of ${snack.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
        {/* Confirm & Proceed to Parking Button */}
        <button
          onClick={handleConfirmAndProceed}
          className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition disabled:opacity-50 flex-grow md:flex-grow-0"
          disabled={bookedSeats.length === 0} // Disabled if no seats present
          aria-label="Confirm and proceed to parking options"
        >
          View Parking Options
        </button>

        {/* Proceed to Checkout Button */}
        <button
          onClick={handleProceedToCheckout}
          className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition disabled:opacity-50 flex-grow md:flex-grow-0"
          disabled={bookedSeats.length === 0} // Disabled if no seats present
          aria-label="Proceed to checkout without selecting snacks or parking"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 text-red-600 font-semibold text-center">{error}</div>
      )}
    </div>
  );
}
