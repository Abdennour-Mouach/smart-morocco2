import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Packs from "./pages/Packs";
import Reservation from "./pages/Reservation";
import Register from "./pages/register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact  from "./pages/Contact";
import PackDetails from "./pages/PackDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./admin/AdminDashboard"; 
import ManagePacks from "./admin/ManagePacks";
import ManageUsers from "./admin/ManageUsers";
import ManageReservations from "./admin/ManageReservations";
import Footer from "./pages/Footer";

function Layout() {
  const location = useLocation();

  // routes sans navbar
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/PackDetails" element={<PackDetails />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/packs" element={<ManagePacks />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/reservations" element={<ManageReservations />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;