import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="w-full py-2 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-800 transition"
      >
        Login
      </button>
    </form>
  );
}
