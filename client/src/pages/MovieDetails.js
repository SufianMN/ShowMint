import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <img
        src={movie.poster || "/placeholder.png"}
        alt={movie.title}
        className="w-full rounded-2xl mb-6"
      />
      <h1 className="text-3xl font-extrabold mb-4">{movie.title}</h1>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Genres:</span> {movie.genres?.join(", ")}</p>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Duration:</span> {movie.duration}</p>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Rating:</span> {movie.rating}</p>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Language:</span> {movie.language}</p>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Director:</span> {movie.director}</p>
      <p className="text-gray-600 mb-6"><span className="font-semibold">Cast:</span> {movie.cast?.join(", ")}</p>
      <p className="mb-6">{movie.description}</p>
      <button
        onClick={() => navigate(`/movie/${movie._id}/booking`)}
        className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition"
      >
        Book Now
      </button>
    </div>
  );
}
