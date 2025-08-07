import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLanguage, FaClock, FaUtensils } from "react-icons/fa";

export default function Sidebar() {
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  // Language links array for map rendering and easy extension
  const languages = [
    { name: "Marathi", path: "/language/marathi" },
    { name: "Hindi", path: "/language/hindi" },
    { name: "English", path: "/language/english" }
  ];

  return (
    <nav className="fixed top-16 left-0 w-60 min-h-screen bg-gradient-to-b from-zinc-900/95 via-purple-900/90 to-indigo-900/95 backdrop-blur-lg text-white pt-6 shadow-2xl border-r border-white/10">

      {/* Languages Section */}
      <button
        onClick={() => setLangOpen(!langOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-all duration-300 group ${
          langOpen ? "bg-purple-700/50 backdrop-blur-sm" : ""
        } rounded-lg select-none font-semibold`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <FaLanguage className="w-5 h-5" />
          </div>
          <span className="group-hover:text-purple-300 transition-colors">Languages</span>
        </div>
        <svg
          className={`w-5 h-5 text-white/70 group-hover:text-white transition-transform duration-300 ${
            langOpen ? "rotate-90" : ""
          }`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Language Links (Dropdown) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          langOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-10 mt-2 space-y-1 border-l-2 border-purple-500/30 pl-6">
          {languages.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`block py-2 px-3 rounded-lg text-sm hover:bg-white/10 hover:text-purple-300 transition-colors duration-200 ${
                location.pathname === path ? "bg-purple-600/50 text-purple-300" : "text-white/80"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Link */}
      <Link
        to="/upcoming"
        className={`flex items-center gap-3 px-6 py-4 hover:bg-white/10 transition-all duration-300 group mt-4 rounded-lg ${
          location.pathname.startsWith("/upcoming")
            ? "bg-purple-700/50 backdrop-blur-sm border-r-2 border-purple-400 text-purple-300"
            : "text-white"
        }`}
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <FaClock className="w-5 h-5" />
        </div>
        <span className="font-semibold group-hover:text-purple-300 transition-colors">Upcoming</span>
      </Link>

      {/* Snacks & Parking Link */}
      <Link
        to="/snacks-parking"
        className={`flex items-center gap-3 px-6 py-4 hover:bg-white/10 transition-all duration-300 group mt-2 rounded-lg ${
          location.pathname.startsWith("/snacks-parking")
            ? "bg-purple-700/50 backdrop-blur-sm border-r-2 border-purple-400 text-purple-300"
            : "text-white"
        }`}
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <FaUtensils className="w-5 h-5" />
        </div>
        <span className="font-semibold group-hover:text-purple-300 transition-colors">Snacks & Parking</span>
      </Link>

      {/* Decorative gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/80 to-transparent pointer-events-none"></div>
    </nav>
  );
}
