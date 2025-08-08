import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { MapPin, Star, Clock } from "lucide-react";

export default function Parking() {
  const [parking, setParking] = useState([]);
  const [snacksList, setSnacksList] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Data from Snacks page
  const { movieId, seats: bookedSeatIds, selectedSnacks } = location.state || {};

  // Fetch parking & snack options
  useEffect(() => {
    Promise.all([api.get("/parking"), api.get("/snacks")])
      .then(([parkingRes, snacksRes]) => {
        setParking(parkingRes.data || []);
        setSnacksList(snacksRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setParking([]);
        setSnacksList([]);
        setLoading(false);
      });
  }, []);

  // Fetch booked seat details
  useEffect(() => {
    if (!bookedSeatIds || bookedSeatIds.length === 0) return;
    api
      .post("/seats/bulk", { seatIds: bookedSeatIds })
      .then((res) => setBookedSeats(res.data))
      .catch((err) => console.error("Failed to fetch seat details:", err));
  }, [bookedSeatIds]);

  // Calculate total = seats + snacks + parking
  useEffect(() => {
    const BASE_PRICE = 100; // base per seat
    const seatsTotal = bookedSeats.reduce(
      (sum, seat) => sum + BASE_PRICE * (seat.priceMultiplier || 1),
      0
    );

    const snacksTotal = Object.entries(selectedSnacks || {}).reduce(
      (sum, [snackId, qty]) => {
        const snackItem = snacksList.find((s) => s._id === snackId);
        return sum + ((snackItem?.price || 0) * qty);
      },
      0
    );

    const parkingTotal = selectedParking
      ? parking.find((p) => p._id === selectedParking)?.price || 0
      : 0;

    setTotalAmount(seatsTotal + snacksTotal + parkingTotal);
  }, [bookedSeats, snacksList, selectedSnacks, selectedParking, parking]);

  const getAvailabilityStatus = (p) => {
    if (typeof p.availability === "string") return p.availability;
    if (p.capacity === 0) return "Full";
    return "Available";
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200";
      case "Limited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Full":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading Parking Options...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6 pb-20">
      {/* Back to Snacks */}
      <button
        onClick={() =>
          navigate("/snacks-parking", {
            state: { movieId, seats: bookedSeatIds, selectedSnacks },
          })
        }
        className="mb-6 text-purple-700 underline hover:text-purple-900"
      >
        &larr; Back to Snacks
      </button>

      {/* Booked Seats & Total */}
      <div className="mb-8 p-4 bg-purple-100 rounded shadow flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-purple-800">
            Your Booked Seats:
          </h3>
          <div className="flex flex-wrap gap-3">
            {bookedSeats.length > 0 ? (
              bookedSeats.map((seat) => (
                <div
                  key={seat._id}
                  className="px-3 py-1 rounded bg-purple-600 text-white font-medium"
                >
                  {seat.row || ""}
                  {seat.seatNumber}
                </div>
              ))
            ) : (
              <p className="text-purple-700">No seat information</p>
            )}
          </div>
        </div>
        <div className="text-lg font-bold text-purple-800">Total: ₹{totalAmount}</div>
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {parking.map((p) => {
          const status = getAvailabilityStatus(p);
          const isSelected = selectedParking === p._id;
          return (
            <div
              key={p._id}
              className={`group bg-white rounded-2xl shadow-lg cursor-pointer flex flex-col border ${
                isSelected ? "border-purple-500 ring-2 ring-purple-300" : "border-transparent"
              }`}
              onClick={() => setSelectedParking(p._id)}
            >
              <div className="relative">
                <img
                  src={p.imageUrl || "https://via.placeholder.com/400x240?text=No+Image"}
                  alt={p.type}
                  className="w-full h-40 object-cover"
                />
                <span
                  className={`absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-lg border ${getAvailabilityColor(
                    status
                  )}`}
                >
                  {status}
                </span>
                {p.distance && (
                  <span className="absolute top-4 right-4 bg-black/70 text-white text-xs rounded-full px-2 py-0.5 flex items-center gap-1">
                    <MapPin className="inline w-3 h-3" />
                    {p.distance}
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-lg text-purple-900">{p.type}</h3>
                  {p.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-500">{p.rating}</span>
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{p.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-semibold text-purple-700">
                    {p.price === 0 ? "Free" : <>₹{p.price}<span className="text-xs text-gray-400">/hr</span></>}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Buttons Section */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
        {/* Confirm Selected Parking */}
        <button
          type="button"
          disabled={!selectedParking}
          className={`bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-grow md:flex-grow-0`}
          onClick={() => {
            if (!selectedParking) return;
            navigate("/booking-summary", {
              state: {
                movieId,
                seats: bookedSeatIds,
                selectedSnacks,
                selectedParking,
                totalAmount,
              },
            });
          }}
          aria-label="Confirm selected parking and proceed to booking summary"
        >
          Confirm
        </button>

        {/* Proceed without Parking */}
        <button
          type="button"
          disabled={bookedSeatIds?.length === 0}
          className={`bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-grow md:flex-grow-0`}
          onClick={() =>
            navigate("/booking-summary", {
              state: {
                movieId,
                seats: bookedSeatIds,
                selectedSnacks,
                selectedParking: null,
                totalAmount,
              },
            })
          }
          aria-label="Proceed to checkout without selecting parking"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-14 text-center">
        <p className="text-gray-500 mb-4">Need help choosing parking?</p>
        <button className="inline-flex items-center gap-2 border border-purple-200 px-6 py-2 bg-white rounded-full text-purple-700 hover:bg-purple-100 transition font-semibold">
          <Clock className="w-4 h-4" /> Contact Support
        </button>
      </div>
    </div>
  );
}
