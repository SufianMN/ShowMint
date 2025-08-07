import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Trailers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  // Helper: convert a YouTube watch URL or full URL to a proper embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      // YouTube watch URL -> embed URL
      if (urlObj.hostname.includes("youtube.com")) {
        const videoId = urlObj.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      // Already an embed URL or other url, just return as is
      return url;
    } catch {
      return url; // if URL parsing fails, return original
    }
  };

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) return <div className="text-center mt-8">Loading trailer...</div>;

  const embedUrl = getEmbedUrl(movie.trailerUrl);

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
          src={embedUrl}
          title={`${movie.title} Trailer`}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      <p className="mt-4 text-gray-700">{movie.description}</p>
    </div>
  );
}
