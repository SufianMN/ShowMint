import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Trailers from './pages/Trailers';
import SeatBooking from './pages/SeatBooking';
import TicketSummary from './pages/TicketSummary';
import FinalTicket from './pages/FinalTicket';
import SnacksParking from './pages/SnacksParking';
import Profile from './pages/Profile';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Sidebar />
      <main style={{ marginLeft: 250, padding: 20, marginTop: 60 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/trailers/:id" element={<Trailers />} />
          <Route path="/seat-booking/:id" element={<SeatBooking />} />
          <Route path="/ticket-summary" element={<TicketSummary />} />
          <Route path="/final-ticket" element={<FinalTicket />} />
          <Route path="/snacks-parking" element={<SnacksParking />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegister={setUser} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
