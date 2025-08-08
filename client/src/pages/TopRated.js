import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function TopRated() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get("/movies")
      .then(res => {
        // Filter and sort top rated movies here to get consistent data
        const topRatedMovies = res.data
          .filter((m)=> m.topRated)
        setMovies(topRatedMovies);
      })
      .catch(() => setMovies([]));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h2 className="text-3xl font-bold mb-8">Top Rated Movies</h2>
      <div className="flex flex-wrap gap-8">
        {movies.length > 0
          ? movies.map(movie => <MovieCard key={movie._id} movie={movie} />)
          : <div>No top rated movies found.</div>}
      </div>
    </div>
  );
}
