import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function HindiMovies() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    api.get("/movies")
      .then(res => setMovies(res.data.filter(m => m.language?.toLowerCase() === "hindi")))
      .catch(() => setMovies([]));
  }, []);
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8">Hindi Movies</h2>
      <div className="flex flex-wrap gap-8">
        {movies.length > 0
          ? movies.map(m => <MovieCard key={m._id} movie={m} />)
          : <div>No Hindi movies found.</div>}
      </div>
    </div>
  );
}
