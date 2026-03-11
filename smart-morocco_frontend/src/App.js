import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Packs from "./pages/Packs";
import Reservation from "./pages/Reservation";
import Register from "./pages/register";
import Login from "./pages/Login";
import Review from "./pages/Review";
import PackDetails from "./pages/PackDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./admin/AdminDashboard"; 
import ManagePacks from "./admin/ManagePacks";
import ManageUsers from "./admin/ManageUsers";
import ManageReservations from "./admin/ManageReservations";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/review" element={<Review />} />
        <Route path="/PackDetails" element={<PackDetails />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/packs" element={<ManagePacks />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/reservations" element={<ManageReservations />} />
      </Routes>
    </Router>
  );
}

export default App;