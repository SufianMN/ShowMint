import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Trailers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) return <div className="text-center mt-8">Loading trailer...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">{movie.title} - Trailer</h2>
      <div className="relative pb-[56.25%] h-0 rounded-xl shadow-lg overflow-hidden">
        <iframe
          src={movie.trailerUrl}
          title={`${movie.title} Trailer`}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
      <p className="mt-4 text-gray-700">{movie.description}</p>
    </div>
  );
}
