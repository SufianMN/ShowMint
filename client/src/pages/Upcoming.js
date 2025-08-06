import React, { useEffect, useState } from "react";
import api from "../utils/api"; // Make sure your api utility is correctly implemented
import MovieCard from "../components/MovieCard";

export default function Upcoming() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/movies")
      .then(res => {
        // Filter for movies with status "upcoming"
        const upcomingMovies = res.data.filter(movie => movie.status === "upcoming");
        setMovies(upcomingMovies);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load upcoming movies. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading upcoming movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-600 px-4">
        <p>{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No upcoming movies available at the moment.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
