import React from "react";

export default function Profile({ user }) {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-purple-900 flex items-center justify-center text-5xl font-extrabold select-none">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="opacity-80">{user.email}</p>
          <p>Member since 2021</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Loyalty Points</h3>
      <div className="inline-block bg-purple-900 rounded-full py-2 px-6 font-bold text-lg">
        {user.loyaltyPoints || 0}
      </div>
      {/* You can add booking history & favorite movies sections here */}
    </div>
  );
}
