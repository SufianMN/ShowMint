import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, Clock } from "lucide-react";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    navigate(`/trailers/${movie._id}`);
  };

  return (
    <div
      onClick={handleMovieClick}
      className="w-60 bg-white rounded-2xl shadow-xl overflow-hidden relative cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
    >
      {/* Movie Poster Container */}
      <div className="relative overflow-hidden">
        <img
          src={
            movie.poster ||
            "https://images.unsplash.com/photo-1489599763687-434d5c0e8e6e?w=400&h=600&fit=crop"
          }
          alt={movie.title}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Rated Badge */}
        {movie.topRated && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Top Rated</span>
            </div>
          </div>
        )}

        {/* Watch Trailer Button */}
        <button
          onClick={handleTrailerClick}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 hover:scale-105 border border-white/30 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          aria-label={`Watch trailer for ${movie.title}`}
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            <span className="font-medium">Trailer</span>
          </div>
        </button>
      </div>

      {/* Movie Info Section */}
      <div className="p-5 bg-gradient-to-b from-white to-gray-50">
        {/* Movie Title */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors duration-200">
          {movie.title}
        </h3>

        {/* Genres */}
        <div className="text-sm text-gray-600 mb-3 line-clamp-1">
          {movie.genres?.join(" • ") || "Adventure • Drama"}
        </div>

        {/* Rating and Duration */}
        <div className="flex items-center justify-between">
          {/* Rating Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-current text-yellow-500" />
            <span className="font-semibold">{movie.rating || "8.5"}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{movie.duration || "2h 30m"}</span>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
