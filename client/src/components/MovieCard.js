import React from "react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="w-60 bg-white rounded-xl shadow-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-transform"
    >
      <img
        src={movie.posterUrl || "https://via.placeholder.com/250x375?text=No+Image"}
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
      <button
        onClick={e => {
          e.stopPropagation();
          navigate(`/trailers/${movie._id}`);
        }}
        className="absolute bottom-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full shadow hover:bg-purple-800"
      >
        Watch Trailer
      </button>
      {movie.topRated && (
        <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          Top Rated
        </span>
      )}
      <div className="p-4">
        <h3 className="font-extrabold text-lg mb-1">{movie.title}</h3>
        <div className="text-sm text-gray-500 mb-2">{movie.genres?.join(", ")}</div>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-900 px-2 py-1 rounded-full text-xs font-bold">
            ⭐ {movie.rating || "N/A"}
          </span>
          <span className="text-xs text-gray-400">{movie.duration}</span>
        </div>
      </div>
    </div>
  );
}
