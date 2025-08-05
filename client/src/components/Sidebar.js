import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLanguage, FaClock, FaUtensils } from "react-icons/fa";

export default function Sidebar() {
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-16 left-0 w-60 min-h-screen bg-gradient-to-b from-zinc-900 to-indigo-900 text-white pt-4">
      <button
        onClick={() => setLangOpen(!langOpen)}
        className={`w-full flex items-center gap-3 px-6 py-3 text-lg hover:bg-purple-700 transition ${
          langOpen ? "bg-purple-800" : ""
        }`}
      >
        <FaLanguage /> Languages
      </button>
      {langOpen && (
        <div className="ml-10 flex flex-col gap-1">
          <Link to="/language/marathi" className="hover:underline">
            Marathi
          </Link>
          <Link to="/language/hindi" className="hover:underline">
            Hindi
          </Link>
          <Link to="/language/english" className="hover:underline">
            English
          </Link>
        </div>
      )}
      <Link
        to="/upcoming"
        className={`flex items-center gap-3 px-6 py-3 text-lg hover:bg-purple-700 transition ${
          location.pathname.startsWith("/upcoming") ? "underline" : ""
        }`}
      >
        <FaClock /> Upcoming
      </Link>
      <Link
        to="/snacks-parking"
        className={`flex items-center gap-3 px-6 py-3 text-lg hover:bg-purple-700 transition ${
          location.pathname.startsWith("/snacks-parking") ? "underline" : ""
        }`}
      >
        <FaUtensils /> Snacks & Parking
      </Link>
    </nav>
  );
}
