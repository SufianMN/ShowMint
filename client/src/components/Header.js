import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Info, User, LogOut } from "lucide-react";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-500 to-indigo-800 text-white flex items-center px-8 z-50 gap-6 backdrop-blur-sm shadow-lg border-b border-white/10">

      {/* Logo */}
      <div
        className="font-extrabold text-2xl cursor-pointer flex-shrink-0 hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent select-none"
        onClick={() => navigate("/")}
      >
        ShowMint
      </div>

      {/* Search Input with icon */}
      <div className="relative group flex-shrink-0">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" 
        />
        <input
          type="text"
          placeholder="Search movies..."
          className="rounded-full pl-10 pr-4 py-2 w-64 bg-white/15 backdrop-blur-sm placeholder-white/80 text-white shadow-inner border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300 hover:bg-white/20"
        />
      </div>

      {/* Spacer to push next items to the right */}
      <div className="flex-1" />

      {/* Location select, About button, and User/Auth buttons */}
      <div className="flex items-center space-x-4">

        {/* Location Selector with icon */}
        <div className="relative group flex-shrink-0">
          <MapPin 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" 
          />
          <select className="rounded-full pl-10 pr-8 py-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 appearance-none cursor-pointer whitespace-nowrap">
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Bangalore</option>
            <option>Chennai</option>
            <option>Hyderabad</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* About Us Button with icon */}
        <button
          className="flex items-center gap-1 text-white hover:text-purple-200 transition-all duration-200 hover:scale-105 whitespace-nowrap"
          onClick={() => navigate("/about")}
          aria-label="Navigate to About Us"
        >
          <Info className="w-4 h-4" />
          About Us
        </button>

        {user ? (
          <>
            <div
              className="flex items-center justify-center w-11 h-11 bg-purple-700 rounded-full font-bold text-lg cursor-pointer select-none"
              onClick={() => navigate("/profile")}
              aria-label="Go to Profile"
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter") navigate("/profile"); }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              className="flex items-center gap-1 bg-red-500 px-4 py-2 rounded-full text-white font-bold whitespace-nowrap hover:bg-red-600 transition"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="flex items-center gap-1 border-2 border-white rounded-full px-4 py-2 text-white hover:bg-white/20 transition whitespace-nowrap"
              onClick={() => navigate("/login")}
              aria-label="Login"
            >
              <User className="w-4 h-4" />
              Login
            </button>
            <button
              className="flex items-center gap-1 bg-purple-600 px-4 py-2 rounded-full text-white font-bold hover:bg-purple-700 transition whitespace-nowrap"
              onClick={() => navigate("/register")}
              aria-label="Register"
            >
              <User className="w-4 h-4" />
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}
