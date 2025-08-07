import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SnacksParking() {
  const [snacks, setSnacks] = useState([]);
  const [parking, setParking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/snacks").then((res) => setSnacks(res.data)).catch(console.error);
    api.get("/parking").then((res) => setParking(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6 pb-10"> {/* Added bottom padding to avoid overlap with fixed footer nav if any */}
      <h2 className="text-3xl font-bold mb-6">Snacks & Parking</h2>

      {/* Snacks Section */}
      <h3 className="text-2xl font-semibold mb-4">Snacks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {snacks.map((snack) => (
          <div
            key={snack._id}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition"
          >
            <img
              src={snack.image || "https://via.placeholder.com/200x150?text=No+Image"}
              alt={snack.name}
              className="rounded-lg mb-2 object-cover w-full h-40"
            />
            <h4 className="font-semibold">{snack.name}</h4>
            <p className="text-purple-700 font-bold">₹{snack.price}</p>
          </div>
        ))}
      </div>

      {/* Parking Section */}
      

      {/* Button to navigate to the separate parking page */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/parking")}
          className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
          type="button"
        >
          View Parking Options
        </button>
      </div>
    </div>
  );
}
