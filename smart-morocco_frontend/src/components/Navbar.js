import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Compass, User, Star, Calendar, Package } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Accueil", icon: <Compass size={20} /> },
    { path: "/packs", label: "Packs", icon: <Package size={20} /> },
    { path: "/reservation", label: "Réservation", icon: <Calendar size={20} /> },
    { path: "/review", label: "Avis", icon: <Star size={20} /> },
    { path: "/Profile", label: "Profil", icon: <User size={20} /> },
    { path: "/login", label: "Connexion", icon: <User size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">ⵣ</span>
          <span className="logo-text">Smart<span className="logo-highlight">Morocco</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {isActive(link.path) && <span className="active-dot"></span>}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${isActive(link.path) ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="mobile-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          border-bottom: 1px solid rgba(15, 76, 117, 0.1);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo Styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
          color: #0f4c75;
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e272e;
        }

        .logo-highlight {
          color: #0f4c75;
          font-weight: 700;
          position: relative;
        }

        .logo-highlight::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #0f4c75, #00b8b0);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .logo:hover .logo-highlight::after {
          transform: scaleX(1);
        }

        /* Desktop Menu */
        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          color: #1e272e;
          text-decoration: none;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .nav-link:hover {
          background: linear-gradient(135deg, rgba(15, 76, 117, 0.1), rgba(0, 184, 176, 0.1));
          color: #0f4c75;
        }

        .nav-link:hover .nav-icon {
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, #0f4c75, #00b8b0);
          color: white;
          box-shadow: 0 4px 15px rgba(15, 76, 117, 0.3);
        }

        .active-dot {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: translateX(-50%) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) scale(1.5); opacity: 0.5; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #0f4c75;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(15, 76, 117, 0.1);
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: white;
          padding: 1rem;
          border-top: 1px solid rgba(15, 76, 117, 0.1);
          transform: translateY(-100%);
          transition: transform 0.3s ease;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: #1e272e;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-link:hover {
          background: rgba(15, 76, 117, 0.1);
          padding-left: 1.5rem;
        }

        .mobile-link.active {
          background: linear-gradient(135deg, #0f4c75, #00b8b0);
          color: white;
        }

        .mobile-icon {
          display: flex;
          align-items: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .navbar-container {
            padding: 0.8rem 1.5rem;
          }

          .logo-text {
            font-size: 1.3rem;
          }
        }

        /* Animation for mobile menu items */
        .mobile-menu.open .mobile-link {
          animation: slideIn 0.3s ease forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-menu.open .mobile-link:nth-child(1) { animation-delay: 0.1s; }
        .mobile-menu.open .mobile-link:nth-child(2) { animation-delay: 0.2s; }
        .mobile-menu.open .mobile-link:nth-child(3) { animation-delay: 0.3s; }
        .mobile-menu.open .mobile-link:nth-child(4) { animation-delay: 0.4s; }
        .mobile-menu.open .mobile-link:nth-child(5) { animation-delay: 0.5s; }
      `}</style>
    </nav>
  );
};

export default Navbar;