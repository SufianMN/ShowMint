import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Parking() {
  const [parking, setParking] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  api
    .get("/parking")  // correct path if axios baseURL is '/api'
    .then((res) => {
      console.log("Fetched parking data:", res.data);
      setParking(res.data);
    })
    .catch((error) => {
      console.error("Error fetching parking data:", error);
    });
}, []);


  if (parking.length === 0) {
    return <div className="text-center mt-8 text-gray-600">No parking options available.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6 pb-10">
      <h2 className="text-3xl font-bold mb-6">Parking Options</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {parking.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition transform"
            onClick={() => navigate(`/parking/${p._id}`)} // Optional details page navigation
          >
            <img
              src={p.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={p.type}
              className="rounded-lg mb-4 object-cover w-full h-40"
            />
            <h3 className="font-semibold text-lg mb-2">{p.type}</h3>
            <p className="text-gray-600 mb-2">{p.description}</p>
            <p className="text-purple-700 font-bold">
              {p.price === 0 ? "Free" : `₹${p.price}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
