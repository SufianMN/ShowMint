import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SeatBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api
      .get(`/seats?movieId=${id}`)
      .then((res) => setSeats(res.data))
      .catch(() => setSeats([]));
  }, [id]);

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceed = () => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    navigate("/ticket-summary");
  };

  const seatStyles = {
    VIP: "border-2 border-yellow-400 bg-yellow-300",
    Regular: "border border-gray-400 bg-gray-200",
    Disabled: "bg-gray-400 cursor-not-allowed",
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Select Seats</h2>
      <div className="grid grid-cols-8 gap-3">
        {seats.map((seat) => {
          const selected = selectedSeats.includes(seat._id);
          return (
            <button
              key={seat._id}
              disabled={!seat.isAvailable || seat.seatType === "Disabled"}
              onClick={() => toggleSeatSelection(seat._id)}
              className={`${seatStyles[seat.seatType]} rounded hover:opacity-80 focus:outline-none ${
                selected
                  ? "bg-purple-600 text-white font-bold"
                  : "text-gray-900 cursor-pointer"
              }`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>
      <button
        className="mt-6 w-full rounded-full bg-purple-700 text-white font-bold py-3 disabled:bg-gray-400 cursor-pointer transition"
        disabled={selectedSeats.length === 0}
        onClick={handleProceed}
      >
        Proceed
      </button>
    </div>
  );
}
