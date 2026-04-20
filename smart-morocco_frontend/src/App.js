import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Packs from "./pages/Packs";
import Reservation from "./pages/Reservation";
import Register from "./pages/register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PackDetails from "./pages/PackDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./admin/AdminDashboard"; 
import Footer from "./pages/Footer";
import ChatbotWidget from "./components/ChatbotWidget";

function Layout() {
  const location = useLocation();

  // routes sans navbar
  const hideNavbarRoutes = [
    "/login", 
    "/register",
    "/admin",
    "/admin/packs",
    "/admin/users",
    "/admin/restaurants",
    "/admin/transports",
    "/admin/activites",
    "/admin/hebergements",
    "/admin/contactAdmin",
    "/admin/reservations",
    "/admin/reviews"
  ];
  
  const hideNavbar = hideNavbarRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

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
        <Route path="/packs/:id" element={<PackDetails />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Routes Admin - tout est géré dans AdminDashboard */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        <Route path="/footer" element={<Footer />} />
      </Routes>
      <ChatbotWidget />
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
