import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-500 to-indigo-800 text-white flex items-center px-8 z-50 gap-4">
      <div className="font-extrabold text-2xl cursor-pointer" onClick={() => navigate("/")}>
        ShowMint
      </div>
      <input
        type="text"
        placeholder="Search movies..."
        className="rounded-full px-4 py-2 w-64 bg-white/20 placeholder-white placeholder-opacity-90 shadow-sm focus:outline-none"
      />
      <select className="rounded-full px-3 py-2 bg-white/20 text-white ml-2">
        <option>Mumbai</option>
        <option>Delhi</option>
        <option>Bangalore</option>
        <option>Chennai</option>
        <option>Hyderabad</option>
      </select>
      <button className="ml-2 text-white hover:underline transition" onClick={() => navigate("/about")}>
        About Us
      </button>
      {user ? (
        <>
          <div className="ml-6 flex items-center justify-center w-11 h-11 bg-purple-700 rounded-full font-bold text-lg cursor-pointer"
               onClick={() => navigate("/profile")}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="ml-2 bg-red-500 px-4 py-2 rounded-full text-white font-bold" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button className="ml-6 border-2 border-white rounded-full px-4 py-2 text-white hover:bg-white/20 transition"
                  onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="ml-2 bg-purple-600 px-4 py-2 rounded-full text-white font-bold"
                  onClick={() => navigate("/register")}>
            Register
          </button>
        </>
      )}
    </header>
  );
}
