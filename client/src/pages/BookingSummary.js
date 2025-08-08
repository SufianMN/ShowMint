import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import { loadStripe } from "@stripe/stripe-js";
import {
  User,
  QrCode,
  Download,
  Phone,
  Mail,
  Star,
} from "lucide-react";

export default function BookingSummary() {
  const location = useLocation();

  const bookingData = location.state;

  const {
    movieId,
    seats: seatIds,
    selectedSnacks,
    selectedParking,
    totalAmount,
  } = bookingData || {};

  const [snacksList, setSnacksList] = useState([]);
  const [parkingList, setParkingList] = useState([]);
  const [seatDetails, setSeatDetails] = useState([]);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    api.get("/snacks")
      .then(res => setSnacksList(res.data))
      .catch(() => setSnacksList([]));
    api.get("/parking")
      .then(res => setParkingList(res.data))
      .catch(() => setParkingList([]));
  }, []);

  useEffect(() => {
    if (!seatIds || seatIds.length === 0) return;
    api.post("/seats/bulk", { seatIds })
      .then(res => setSeatDetails(res.data))
      .catch(() => setSeatDetails([]));
  }, [seatIds]);

  if (!bookingData || !movieId || !seatIds) {
    return (
      <div className="p-4 text-center text-red-600">
        No booking data found. Please start your booking!
      </div>
    );
  }

  const ticketPrice = 400;
  const movieTicketsTotal = seatDetails.length * ticketPrice;

  // Calculate snacks total dynamically
  const snacksTotal =
    selectedSnacks && Object.keys(selectedSnacks).length > 0
      ? Object.entries(selectedSnacks).reduce((total, [snackId, qty]) => {
          const snack = snacksList.find(s => s._id === snackId);
          return total + (snack ? snack.price * qty : 0);
        }, 0)
      : 0;

  const parkingPrice =
    selectedParking
      ? parkingList.find(p => p._id === selectedParking)?.price || 0
      : 0;

  const convenienceFee = 40;

  // Final total sum - you can trust bookingData.totalAmount or compute dynamically
  const computedTotal =
    movieTicketsTotal + snacksTotal + parkingPrice + convenienceFee;

  const generateQRCode = () => setQrGenerated(true);

  const downloadTicket = () => {
    const element = document.createElement("a");
    const file = new Blob(["Ticket downloaded successfully!"], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `ticket-${seatIds.join("-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePayment = async () => {
    if (loadingPayment) return;
    setLoadingPayment(true);

    try {
      const stripe = await stripePromise;

      const response = await fetch(
        "http://localhost:4000/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("No session ID returned");
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 px-6 pb-32">
        <h2 className="mb-8 text-3xl font-bold">Booking Summary</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seat Details */}
            <section className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                <User className="w-5 h-5" />
                Seat Details
              </div>
              <div className="flex flex-wrap gap-2">
                {seatDetails.length > 0 ? (
                  seatDetails.map(seat => (
                    <span
                      key={seat._id}
                      className="px-3 py-1 border-2 border-purple-600 text-purple-600 rounded"
                    >
                      {seat.seatNumber}
                    </span>
                  ))
                ) : (
                  <p>No seat details available.</p>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {seatDetails.length} seat{seatDetails.length > 1 ? "s" : ""}{" "}
                selected
              </p>
            </section>

            {/* Snacks & Parking */}
            {(selectedSnacks && Object.keys(selectedSnacks).length > 0) ||
            selectedParking ? (
              <section className="border rounded-lg p-4">
                <div className="mb-4 font-semibold text-lg">Add-ons</div>

                {/* Snacks */}
                {selectedSnacks && Object.keys(selectedSnacks).length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold">Snacks</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedSnacks).map(([snackId, qty]) => {
                        const snack = snacksList.find(s => s._id === snackId);
                        return (
                          <div key={snackId} className="flex justify-between">
                            <span>
                              {snack ? snack.name : snackId} x{qty}
                            </span>
                            <span>₹{(snack ? snack.price : 0) * qty}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Parking */}
                {selectedParking && (
                  <div>
                    <h4 className="mb-2 font-semibold">Parking</h4>
                    <div className="flex justify-between text-sm">
                      <span>
                        {parkingList.find(p => p._id === selectedParking)?.type ||
                          selectedParking}
                      </span>
                      <span>
                        ₹
                        {parkingList.find(p => p._id === selectedParking)?.price ||
                          0}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code & Download */}
            <section className="border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-4">
                {qrGenerated ? (
                  <div className="w-32 h-32 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={setQrGenerated.bind(null, true)}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded inline-flex items-center justify-center w-full"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </button>
                )}
              </div>

              <button
                onClick={downloadTicket}
                className="px-4 py-2 mt-3 bg-purple-600 text-white rounded w-full flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </button>
            </section>

            {/* Payment Summary */}
            <section className="border rounded-lg p-4">
              <div className="mb-4 font-semibold text-lg">Payment Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Movie Tickets</span>
                  <span>₹{movieTicketsTotal}</span>
                </div>

                {selectedSnacks && Object.keys(selectedSnacks).length > 0 && (
                  <div className="flex justify-between">
                    <span>Snacks</span>
                    <span>
                      {Object.entries(selectedSnacks).reduce(
                        (total, [snackId, qty]) => {
                          const snack = snacksList.find(s => s._id === snackId);
                          return total + (snack ? snack.price * qty : 0);
                        },
                        0
                      )}
                    </span>
                  </div>
                )}

                {selectedParking && (
                  <div className="flex justify-between">
                    <span>Parking</span>
                    <span>
                      ₹
                      {parkingList.find(p => p._id === selectedParking)?.price ||
                        0}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹40</span>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{totalAmount || computedTotal}</span>
                </div>
              </div>
            </section>

            {/* Help & Support */}
            <section className="border rounded-lg p-4 text-sm space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-600" />
                <div>
                  <p>Helpline</p>
                  <p className="text-gray-600">1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-600" />
                <div>
                  <p>Email Support</p>
                  <p className="text-gray-600">help@cinemax.com</p>
                </div>
              </div>
            </section>

            {/* Rating */}
            <section className="border rounded-lg p-4">
              <div className="mb-3 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                  />
                ))}
              </div>
              <button className="w-full py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-100">
                Submit Rating
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* Fixed Payment Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <button
          onClick={handlePayment}
          disabled={loadingPayment}
          className={`bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 shadow-lg ${
            loadingPayment ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loadingPayment ? "Processing…" : "Proceed to Payment"}
        </button>
      </div>
    </>
  );
}
