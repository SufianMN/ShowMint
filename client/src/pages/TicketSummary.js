import React from "react";
import { useNavigate } from "react-router-dom";

export default function TicketSummary() {
  const navigate = useNavigate();

  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

  // Optionally: implement snack/parking/pricing

  const handleConfirm = () => {
    navigate("/final-ticket");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg text-gray-800">
      <h2 className="text-3xl font-bold mb-8">Ticket Summary</h2>
      <p>
        <span className="font-semibold">Selected Seats:</span> {selectedSeats.length} seats
      </p>
      {/* Add snacks, parking, pricing overview here */}
      <button
        onClick={handleConfirm}
        className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold hover:opacity-90 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
}
