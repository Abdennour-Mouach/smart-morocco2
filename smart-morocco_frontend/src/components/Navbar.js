import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Calendar, ChevronDown, Settings, LogOut, Heart, Bell, Languages } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "fr";
  });
  const location = useLocation();
  const profileMenuRef = useRef(null);

  // Translations
  const translations = {
    fr: {
      nav: {
        home: "Accueil",
        about: "A propos",
        contact: "Contact",
        packs: "Packs",
        reservation: "Réservation",
      },
      auth: {
        login: "Connexion",
        register: "Inscription",
        profile: "Profil",
        myReservations: "Mes Réservations",
        settings: "Paramètres",
        logout: "Déconnexion",
      },
      profile: {
        myProfile: "Mon Profil",
        myReservations: "Mes Réservations",
        settings: "Paramètres",
        logout: "Déconnexion",
      },
      notifications: {
        title: "Notifications",
        noNotifications: "Aucune notification",
        markAsRead: "Marquer comme lue",
      },
      likes: {
        title: "J'adore",
      },
    },
    en: {
      nav: {
        home: "Home",
        about: "About",
        contact: "Contact",
        packs: "Packs",
        reservation: "Reservation",
      },
      auth: {
        login: "Login",
        register: "Register",
        profile: "Profile",
        myReservations: "My Reservations",
        settings: "Settings",
        logout: "Logout",
      },
      profile: {
        myProfile: "My Profile",
        myReservations: "My Reservations",
        settings: "Settings",
        logout: "Logout",
      },
      notifications: {
        title: "Notifications",
        noNotifications: "No notifications",
        markAsRead: "Mark as read",
      },
      likes: {
        title: "Like",
      },
    },
  };

  const t = translations[language];

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Click outside handler for profile menu only
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
    { path: "/", label: t.nav.home },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
    { path: "/packs", label: t.nav.packs },
    { path: "/reservation", label: t.nav.reservation },
  ];

  const mobileAuthLinks = user
    ? [{ path: "/profile", label: t.auth.profile }]
    : [
        { path: "/login", label: t.auth.login },
        { path: "/register", label: t.auth.register },
      ];

  const isActive = (path) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "en" : "fr");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Smart Morocco" className="logo-img" />
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

        {/* Right Section: Langue, J'adore, Notifications, Profil */}
        <div className="right-section">
          {/* Language Switcher */}
          <button className="icon-btn language-btn" onClick={toggleLanguage} title={language === "fr" ? "English" : "Français"}>
            <Languages size={20} />
            <span className="language-text">{language.toUpperCase()}</span>
          </button>

          {/* J'adore Icon (static, no events) */}
          <div className="icon-btn like-btn" title={t.likes.title}>
            <Heart size={20} />
          </div>

          {/* Notification Icon (static, no events) */}
          <div className="icon-btn notification-btn" title={t.notifications.title}>
            <Bell size={20} />
          </div>

          {/* Profile Section */}
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
                        <span>{t.profile.myProfile}</span>
                      </Link>
                      <Link to="/reservation" className="menu-item">
                        <Calendar size={16} />
                        <span>{t.profile.myReservations}</span>
                      </Link>
                      <Link to="/settings" className="menu-item">
                        <Settings size={16} />
                        <span>{t.profile.settings}</span>
                      </Link>
                      <div className="menu-divider"></div>
                      <button onClick={handleLogout} className="menu-item logout">
                        <LogOut size={16} />
                        <span>{t.profile.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn-nav">{t.auth.login}</Link>
                <Link to="/register" className="register-btn-nav">{t.auth.register}</Link>
              </div>
            )}
          </div>
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
        {/* Mobile language toggle */}
        <button onClick={toggleLanguage} className="mobile-link mobile-language-btn">
          <Languages size={18} />
          <span>{language === "fr" ? "English" : "Français"}</span>
        </button>
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

        /* Right section with icons */
        .right-section {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #1e272e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        /* For static icons (no cursor pointer) */
        .icon-btn:not(button) {
          cursor: default;
        }

        .icon-btn:hover {
          background: rgba(15, 76, 117, 0.1);
          color: #0f4c75;
        }

        .language-btn {
          gap: 4px;
          border-radius: 20px;
          padding: 0.5rem 0.8rem;
          cursor: pointer;
        }

        .language-text {
          font-size: 0.8rem;
          font-weight: 600;
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
          z-index: 1000;
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
          gap: 12px;
          padding: 1rem;
          color: #1e272e;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
        }

        .mobile-link:hover {
          background: rgba(15, 76, 117, 0.1);
          padding-left: 1.5rem;
        }

        .mobile-link.active {
          color: #0f4c75;
          font-weight: 600;
        }

        .mobile-language-btn {
          margin-top: 8px;
          justify-content: flex-start;
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

          .right-section {
            gap: 0.4rem;
          }

          .language-text {
            display: none;
          }

          .icon-btn {
            padding: 0.4rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;