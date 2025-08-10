import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Monitor, Users, Clock, MapPin, IndianRupee } from "lucide-react";

const seatTypeColor = {
  Regular: "bg-gray-100 border-gray-300 hover:bg-gray-200",
  VIP: "bg-amber-300 border-amber-400 hover:bg-amber-400",
  Disabled: "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
};

const SeatBooking = ({ movieId }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch seats for the specified movieId
  useEffect(() => {
    setLoading(true);
    api.get(`/seats?movieId=${movieId}`)
      .then((res) => {
        setSeats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load seats:", err);
        setError("Failed to load seats. Please try again.");
        setLoading(false);
      });
  }, [movieId]);

  // Group seats by row letter
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber[0];
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  // Sort seats within each row numerically
  Object.keys(rows).forEach((row) => {
    rows[row].sort((a, b) => {
      const numA = parseInt(a.seatNumber.slice(1));
      const numB = parseInt(b.seatNumber.slice(1));
      return numA - numB;
    });
  });

  const handleSelect = (seat) => {
    if (!seat.isAvailable || seat.seatType === "Disabled") return;
    setSelected((prev) =>
      prev.includes(seat._id)
        ? prev.filter((id) => id !== seat._id)
        : [...prev, seat._id]
    );
  };

  const getSeatPrice = (multiplier) => Math.round(100 * multiplier);

  const total = seats
    .filter((seat) => selected.includes(seat._id))
    .reduce((sum, seat) => sum + getSeatPrice(seat.priceMultiplier || 1), 0);

  const handleBookNow = () => {
    if (selected.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }
    setBooking(true);
    navigate("/snacks-parking", {
      state: { movieId, seats: selected }
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 px-6 pb-10 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading seat map...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-6 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Seats</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> <span>7:30 PM</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> <span>Screen 3, CineMax Multiplex</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />{" "}
            <span>Available: {seats.filter((s) => s.isAvailable).length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Seat Map */}
        <div className="lg:w-3/4 bg-white p-6 rounded-lg shadow">
          {/* Screen */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-full max-w-md h-12 bg-gradient-to-b from-gray-800 to-gray-600 rounded-t-3xl flex items-center justify-center shadow-lg">
                <Monitor className="w-6 h-6 text-white mr-2" />
                <span className="text-white text-sm">SCREEN</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500">All eyes this way please!</p>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 overflow-x-auto">
            {Object.keys(rows).map((rowLetter) => (
              <div
                key={rowLetter}
                className="flex items-center justify-center gap-1"
              >
                {/* Row Label Left */}
                <div className="w-8 flex justify-center font-bold">{rowLetter}</div>

                {/* Seats */}
                <div className="flex gap-1">
                  {rows[rowLetter].map((seat) => {
                    const isSelected = selected.includes(seat._id);
                    const isBooked = !seat.isAvailable;
                    const baseStyle =
                      "w-8 h-8 rounded-t-lg rounded-b-sm border-2 transition-all duration-200 flex items-center justify-center text-[10px] font-bold";
                    return (
                      <button
                        key={seat._id}
                        onClick={() => handleSelect(seat)}
                        disabled={!seat.isAvailable || seat.seatType === "Disabled"}
                        className={[
                          baseStyle,
                          seatTypeColor[seat.seatType],
                          isBooked && "bg-red-200 border-red-300 cursor-not-allowed opacity-60",
                          isSelected && "bg-green-500 border-green-600 shadow-lg scale-110"
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        title={`${seat.seatNumber} - ₹${getSeatPrice(
                          seat.priceMultiplier
                        )} (${seat.seatType})`}
                      >
                        {seat.seatNumber.slice(1)}
                      </button>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <div className="w-8 flex justify-center font-bold">{rowLetter}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300"></div>
              Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-300 border-2 border-amber-400"></div>
              VIP
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border-2 border-green-600"></div>
              Selected
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-300"></div>
              Booked
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400"></div>
              Disabled
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-1/4 space-y-6">
          {/* Price Summary */}
          {selected.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-3">Booking Summary</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {selected.map((id) => {
                  const seat = seats.find((s) => s._id === id);
                  return (
                    <span
                      key={id}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                    >
                      {seat?.seatNumber}
                    </span>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm">
                <span>Tickets ({selected.length})</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Convenience Fee</span>
                <span>₹{Math.round(total * 0.02)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total + Math.round(total * 0.02)}</span>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleBookNow}
            disabled={selected.length === 0 || booking}
            className="w-full py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition disabled:opacity-50 font-bold flex items-center justify-center gap-2"
          >
            {booking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <IndianRupee className="w-4 h-4" />
                {selected.length > 0
                  ? `Pay ₹${total + Math.round(total * 0.02)}`
                  : "Select Seats"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
