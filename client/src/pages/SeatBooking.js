import React, { useEffect, useState } from "react";
import api from "../utils/api";

// Colors per your image
const seatTypeColor = {
  Regular: "bg-gray-200",
  VIP: "bg-yellow-400",
  Disabled: "bg-red-300"
};

const SeatBooking = ({ movieId }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [booking, setBooking] = useState(false);

  // Fetch seats for this movie
  useEffect(() => {
    api.get(`/seats?movieId=${movieId}`)
      .then(res => setSeats(res.data))
      .catch(() => setSeats([]));
  }, [movieId]);

  // Map seats into rows (A–F, columns 1–8)
  const rows = {};
  seats.forEach(seat => {
    const row = seat.seatNumber[0];
    rows[row] = rows[row] || [];
    rows[row].push(seat);
  });

  // Seat select handler
  const handleSelect = seat => {
    if (!seat.isAvailable || seat.seatType === "Disabled") return;
    setSelected(sel =>
      sel.includes(seat._id)
        ? sel.filter(id => id !== seat._id)
        : [...sel, seat._id]
    );
  };

  // Booking logic
  const bookSeats = async () => {
    setBooking(true);
    try {
      await Promise.all(selected.map(id => api.patch(`/seats/${id}/book`)));
      alert("Seats booked!");
      setSelected([]);
      // reload
      const res = await api.get(`/seats?movieId=${movieId}`);
      setSeats(res.data);
    } catch {
      alert("Failed to book seats.");
    }
    setBooking(false);
  };

  // Price calculation (assume base ₹100)
  const total = seats
    .filter(seat => selected.includes(seat._id))
    .reduce((sum, s) => sum + 100 * s.priceMultiplier, 0);

  // Render grid like BookMyShow
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
      <div className="space-y-2 bg-white p-4 rounded shadow">
        {["A", "B", "C", "D", "E", "F"].map(row =>
          <div key={row} className="flex gap-2 items-center">
            <span className="w-5 font-bold">{row}</span>
            {Array(8).fill(0).map((_, idx) => {
              const seat = seats.find(
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
        <button
          onClick={bookSeats}
          disabled={selected.length === 0 || booking}
          className="ml-auto px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {booking ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default SeatBooking;
