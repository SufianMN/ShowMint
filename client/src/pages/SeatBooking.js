import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

// Colors per seat types
const seatTypeColor = {
  Regular: "bg-gray-200",
  VIP: "bg-yellow-400",
  Disabled: "bg-red-300"
};

const SeatBooking = ({ movieId }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  // Fetch seats for the specified movieId
  useEffect(() => {
    setLoading(true);
    api.get(`/seats?movieId=${movieId}`)
      .then(res => {
        setSeats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load seats:", err);
        setError("Failed to load seats. Please try again.");
        setLoading(false);
      });
  }, [movieId]);

  // Group seats by their row (A-F)
  const rows = {};
  seats.forEach(seat => {
    const row = seat.seatNumber[0];
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  // Handle selecting or deselecting seats
  const handleSelect = (seat) => {
    if (!seat.isAvailable || seat.seatType === "Disabled") return;
    setSelected(sel =>
      sel.includes(seat._id)
        ? sel.filter(id => id !== seat._id)
        : [...sel, seat._id]
    );
  };

  // Price calculation assuming base ₹100 and multiplier per seat
  const total = seats
    .filter(seat => selected.includes(seat._id))
    .reduce((sum, seat) => sum + 100 * (seat.priceMultiplier || 1), 0);

  // On "Book Now" click, navigate to Snacks & Parking page with selections
  // Do NOT mark seats as booked here (booking happens after payment)
  const handleBookNow = () => {
    if (selected.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }
    setBooking(true);
    // Navigate with React Router 'to' and pass state data
    // Replace <Link> with programmatic navigation if preferred
  };

  if (loading) return <div className="p-4 text-center">Loading seats...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-2 bg-white p-4 rounded shadow">
        {["A", "B", "C", "D", "E", "F"].map(row =>
          <div key={row} className="flex gap-2 items-center">
            <span className="w-5 font-bold">{row}</span>
            {Array(8).fill(0).map((_, idx) => {
              const seat = rows[row]?.find(
                s => s.seatNumber === `${row}${idx + 1}`
              );
              if (!seat) return (
                <span key={idx} className="w-10 h-10"></span>
              );
              const isSelected = selected.includes(seat._id);
              const isBooked = !seat.isAvailable;
              return (
                <button
                  key={seat._id}
                  disabled={!seat.isAvailable || seat.seatType === "Disabled"}
                  onClick={() => handleSelect(seat)}
                  className={[
                    "w-10 h-10 rounded flex flex-col justify-center items-center text-xs font-bold border hover:scale-110 transition",
                    seatTypeColor[seat.seatType],
                    isBooked && "opacity-40 cursor-not-allowed",
                    isSelected && "ring-2 ring-purple-500 scale-110",
                  ].filter(Boolean).join(" ")}
                  title={`Rs.${seat.priceMultiplier * 100} (${seat.seatType})`}
                  aria-pressed={isSelected}
                >
                  {idx + 1}
                  <span className="text-[0.6em]">{seat.seatType[0]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <div>
          <span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-1"></span>VIP
          <span className="inline-block w-4 h-4 bg-gray-200 rounded mx-2"></span>Regular
          <span className="inline-block w-4 h-4 bg-red-300 rounded mx-2"></span>Disabled
          <span className="inline-block w-4 h-4 bg-purple-600 rounded mx-2"></span>Selected
          <span className="inline-block w-4 h-4 bg-gray-500 opacity-40 rounded mx-2"></span>Booked
        </div>
        <div>
          Selected: <b>{selected.length}</b> seat(s) – Total: <b>₹{total}</b>
        </div>
        {/* On click: navigate passing movieId and selected seat IDs */}
        <Link
          to="/snacks-parking"
          state={{ movieId, seats: selected }}
          className={`ml-auto px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50`}
          aria-disabled={selected.length === 0 || booking}
          tabIndex={selected.length === 0 || booking ? -1 : 0}
        >
          {booking ? "Booking..." : "Book Now"}
        </Link>
      </div>
    </div>
  );
};

export default SeatBooking;
