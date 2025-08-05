import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function SnacksParking() {
  const [snacks, setSnacks] = useState([]);
  const [parking, setParking] = useState([]);

  useEffect(() => {
    api.get("/snacks").then((res) => setSnacks(res.data)).catch(console.error);
    api.get("/parking").then((res) => setParking(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6">
      <h2 className="text-3xl font-bold mb-6">Snacks & Parking</h2>

      <h3 className="text-2xl font-semibold mb-4">Snacks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {snacks.map((snack) => (
          <div key={snack._id} className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition">
            <img
              src={snack.imageUrl || "https://via.placeholder.com/200x150"}
              alt={snack.name}
              className="rounded-lg mb-2"
            />
            <h4 className="font-semibold">{snack.name}</h4>
            <p className="text-purple-700 font-bold">₹{snack.price}</p>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-semibold mb-4">Parking</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {parking.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition">
            <h4 className="font-semibold mb-2">{p.name}</h4>
            <p className="text-gray-600 mb-2">{p.description}</p>
            <p className="text-purple-700 font-bold">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
