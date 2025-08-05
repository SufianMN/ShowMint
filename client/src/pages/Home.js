import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get("/movies").then((res) => setMovies(res.data)).catch(console.error);
  }, []);

  const featured = movies.find((m) => m.featured);
  const topRated = movies.filter((m) => m.topRated);
  const nowShowing = movies.filter((m) => m.status === "now-showing");

  return (
    <div>
      {featured && (
        <section className="bg-gradient-to-br from-purple-500 to-indigo-800 text-white rounded-2xl px-10 py-14 mt-8 mb-10 shadow-2xl">
          <h1 className="text-4xl font-black mb-3 drop-shadow-lg">
            THE DREAM IS REAL
          </h1>
          <p className="text-lg mb-4 opacity-80">
            FROM THE DIRECTOR OF THE DARK KNIGHT
          </p>
          <button
            onClick={() => window.location.href = `/movie/${featured._id}`}
            className="bg-white text-purple-600 font-bold px-8 py-3 rounded-full shadow hover:bg-purple-100"
          >
            Book Now
          </button>
        </section>
      )}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-3 text-gray-800">Top Rated Movies</h2>
        <div className="flex flex-wrap gap-8">
          {topRated.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
        </div>
      </section>
      <section>
        <h2 className="font-bold text-xl mb-3 text-gray-800">Now Showing</h2>
        <div className="flex flex-wrap gap-8">
          {nowShowing.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
        </div>
      </section>
    </div>
  );
}
