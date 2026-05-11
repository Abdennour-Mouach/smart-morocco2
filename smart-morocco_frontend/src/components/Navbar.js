import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Calendar, ChevronDown, Settings, LogOut, Heart, Bell, Languages, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { language, currentLanguage, languages, setLanguage, t } = useLanguage();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  // Close floating menus when the user clicks elsewhere.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
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

  const selectLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageMenuOpen(false);
    setIsOpen(false);
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
          <div className="language-switcher" ref={languageMenuRef}>
            <button
              className="icon-btn language-btn"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setIsLanguageMenuOpen((open) => !open);
              }}
              title={`${t.language.current}: ${currentLanguage.label}`}
              aria-label={t.language.choose}
              aria-haspopup="listbox"
              aria-expanded={isLanguageMenuOpen}
            >
              <Languages size={20} />
              <span className="language-text">{currentLanguage.short}</span>
              <ChevronDown size={14} className={`language-chevron ${isLanguageMenuOpen ? "open" : ""}`} />
            </button>

            {isLanguageMenuOpen && (
              <div className="language-menu" role="listbox" aria-label={t.language.choose}>
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={item.code === language}
                    lang={item.locale}
                    dir={item.dir}
                    className={`language-option ${item.code === language ? "active" : ""}`}
                    onClick={() => selectLanguage(item.code)}
                  >
                    <span className="language-option-code">{item.short}</span>
                    <span className="language-option-label">{item.label}</span>
                    {item.code === language && <Check size={16} className="language-option-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <Link to="/profile" className="icon-btn like-btn" title={t.likes.title} aria-label="Voir mes favoris">
            <Heart size={20} />
          </Link>

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
                  onClick={() => {
                    setIsLanguageMenuOpen(false);
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
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
        <div className="mobile-language-panel">
          <div className="mobile-language-title">
            <Languages size={18} />
            <span>{t.language.choose}</span>
          </div>
          <div className="mobile-language-options">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                lang={item.locale}
                dir={item.dir}
                className={`mobile-language-option ${item.code === language ? "active" : ""}`}
                onClick={() => selectLanguage(item.code)}
              >
                <span>{item.short}</span>
                {item.code === language && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
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
          text-decoration: none;
        }

        /* For static icons (no cursor pointer) */
        .icon-btn:not(button):not(a) {
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
          min-width: 78px;
        }

        .language-text {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .language-switcher {
          position: relative;
        }

        .language-chevron {
          transition: transform 0.25s ease;
        }

        .language-chevron.open {
          transform: rotate(180deg);
        }

        .language-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 190px;
          padding: 8px;
          background: white;
          border: 1px solid rgba(15, 76, 117, 0.12);
          border-radius: 14px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.14);
          z-index: 1001;
          animation: slideDown 0.25s ease;
        }

        .language-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #1e272e;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .language-option:hover,
        .language-option.active {
          background: rgba(15, 76, 117, 0.1);
          color: #0f4c75;
        }

        .language-option-code {
          width: 34px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f3f6f8;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .language-option-label {
          flex: 1;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .language-option-check {
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

        .mobile-language-panel {
          margin-top: 10px;
          padding: 12px;
          border-top: 1px solid rgba(15, 76, 117, 0.1);
        }

        .mobile-language-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          color: #1e272e;
          font-weight: 600;
        }

        .mobile-language-options {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .mobile-language-option {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid rgba(15, 76, 117, 0.15);
          border-radius: 10px;
          background: white;
          color: #1e272e;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-language-option.active,
        .mobile-language-option:hover {
          border-color: #0f4c75;
          background: rgba(15, 76, 117, 0.1);
          color: #0f4c75;
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
