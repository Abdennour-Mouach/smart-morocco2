import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Calendar, ChevronDown, Settings, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileMenuOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/about", label: "A propos" },
    { path: "/contact", label: "Contact" },
    { path: "/packs", label: "Packs" },
    { path: "/reservation", label: "Reservation" }
  ];

  const mobileAuthLinks = user
    ? [{ path: "/Profile", label: "Profil" }]
    : [
        { path: "/login", label: "Connexion" },
        { path: "/register", label: "Inscription" }
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="images/logo.png" alt="Smart Morocco" className="logo-img" />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Profil utilisateur */}
        <div className="profile-section" ref={profileMenuRef}>
          {user ? (
            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="profile-avatar">
                  {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                </div>
                <span className="profile-name">{user.prenom} {user.nom}</span>
                <ChevronDown size={16} className={`chevron ${isProfileMenuOpen ? "open" : ""}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="profile-menu">
                  <div className="menu-header">
                    <div className="menu-avatar">
                      {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                    </div>
                    <div className="menu-user-info">
                      <span className="menu-user-name">{user.prenom} {user.nom}</span>
                      <span className="menu-user-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="menu-items">
                    <Link to="/profile" className="menu-item">
                      <User size={16} />
                      <span>Mon Profil</span>
                    </Link>
                    <Link to="/reservation" className="menu-item">
                      <Calendar size={16} />
                      <span>Mes Reservations</span>
                    </Link>
                    <Link to="/settings" className="menu-item">
                      <Settings size={16} />
                      <span>Parametres</span>
                    </Link>
                    <div className="menu-divider"></div>
                    <button onClick={handleLogout} className="menu-item logout">
                      <LogOut size={16} />
                      <span>Deconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn-nav">Connexion</Link>
              <Link to="/register" className="register-btn-nav">Inscription</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {navLinks.concat(mobileAuthLinks).map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${isActive(link.path) ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
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
          background: white;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo-img {
          width: 150px;
          height: 100px;
          object-fit: contain;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #1e272e;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #0f4c75;
        }

        /* Profile Section */
        .profile-section {
          position: relative;
        }

        .auth-buttons {
          display: flex;
          gap: 10px;
        }

        .login-btn-nav {
          padding: 8px 20px;
          background: white;
          border: 2px solid #0f4c75;
          color: #0f4c75;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .login-btn-nav:hover {
          background: #0f4c75;
          color: white;
        }

        .register-btn-nav {
          padding: 8px 20px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .register-btn-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        .profile-container {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 15px;
          background: white;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-button:hover {
          border-color: #0f4c75;
        }

        .profile-avatar {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
        }

        .profile-name {
          font-weight: 500;
          color: #1e272e;
        }

        .chevron {
          transition: transform 0.3s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          width: 280px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: slideDown 0.3s ease;
        }

        .menu-header {
          padding: 20px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .menu-avatar {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.2rem;
          text-transform: uppercase;
          border: 2px solid white;
        }

        .menu-user-info {
          display: flex;
          flex-direction: column;
        }

        .menu-user-name {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .menu-user-email {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .menu-items {
          padding: 10px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          color: #1e272e;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .menu-item:hover {
          background: #f8f9fa;
          color: #0f4c75;
        }

        .menu-item.logout:hover {
          color: #dc3545;
        }

        .menu-divider {
          height: 1px;
          background: #eaeaea;
          margin: 10px 0;
        }

        /* Mobile */
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
          color: #0f4c75;
          font-weight: 600;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

          .logo-img {
            width: 70px;
            height: 70px;
          }

          .profile-name {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
