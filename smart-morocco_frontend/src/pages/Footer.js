import React from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const deepBlue = "#0E2576";
  const deepOchre = "#CE7B15";
  const softWhite = "#F9F9F9";

  return (
    <footer className="smart-footer">
      <div className="footer-container">
        {/* Identité - Brand Section */}
        <div className="footer-brand">
          <img 
            src="images/logo.png" 
            alt="Smart Morocco" 
            className="footer-logo" 
          />
          <p className="footer-tagline">
            L'art du voyage intelligent. <br />
            <span className="brand-accent">Immersion exclusive</span> au cœur du Royaume.
          </p>
        </div>

        {/* Navigation - Explore */}
        <div className="footer-section">
          <h4 className="section-title">Explorer</h4>
          <ul className="footer-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/packs">Nos Collections</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Conciergerie - Contact */}
        <div className="footer-section">
          <h4 className="section-title">Conciergerie</h4>
          <div className="contact-details">
            <a href="tel:+2120698653210" className="contact-link">+212 6 98 65 32 10</a>
            <a href="mailto:smartmorocoo@gmail.com" className="contact-link">smartmorocoo@gmail.com</a>
            <p className="address-text">Marrakech, Maroc</p>
          </div>
        </div>

        {/* Newsletter ou Social - L'élégance sociale */}
        <div className="footer-section">
          <h4 className="section-title">Suivez-nous</h4>
          <div className="social-icons-grid">
            <a href="#" aria-label="Instagram" className="icon-wrapper"><FaInstagram /></a>
            <a href="#" aria-label="Facebook" className="icon-wrapper"><FaFacebookF /></a>
            <a href="#" aria-label="LinkedIn" className="icon-wrapper"><FaLinkedinIn /></a>
            <a href="#" aria-label="WhatsApp" className="icon-wrapper"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <div className="legal-links">
            <a href="#">Confidentialité</a>
            <a href="#">Cookies</a>
            <a href="#">Mentions Légales</a>
          </div>
          <p className="copyright">© 2026 SMART MOROCCO — LUXURY TRAVEL DESIGN.</p>
        </div>
      </div>

      <style jsx>{`
        .smart-footer {
          background-color: #ffffff;
          padding: 120px 0 60px 0;
          font-family: 'Inter', sans-serif;
          border-top: 1px solid #f0f0f0;
          color: #121212;
        }

        .footer-container {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.8fr 0.8fr 1fr 1fr;
          gap: 80px;
          padding: 0 50px;
        }

        .footer-logo {
          height: 65px;
          margin-bottom: 35px;
          transition: transform 0.4s ease;
        }

        .footer-tagline {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .brand-accent {
          color: ${deepOchre};
          font-style: italic;
          font-family: 'Playfair Display', serif; /* Optionnel : pour un look luxe */
        }

        /* --- Titres Professionnels --- */
        .section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 40px;
          color: #121212;
          letter-spacing: 4px;
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 20px;
          height: 1px;
          background: ${deepOchre};
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li { margin-bottom: 18px; }

        .footer-links a {
          text-decoration: none;
          color: #666;
          font-size: 14px;
          font-weight: 400;
          transition: all 0.3s ease;
          position: relative;
        }

        /* Effet de ligne sous les liens */
        .footer-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: ${deepOchre};
          transition: width 0.3s ease;
        }

        .footer-links a:hover { color: #121212; }
        .footer-links a:hover::after { width: 100%; }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-link {
          font-size: 14px;
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 400;
        }

        .contact-link:hover { color: ${deepBlue}; }

        .address-text {
          font-size: 13px;
          color: #999;
          margin-top: 5px;
        }

        /* --- Icônes Minimalistes --- */
        .social-icons-grid {
          display: flex;
          gap: 15px;
        }

        .icon-wrapper {
          color: #121212;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border: 1px solid #e5e5e5;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .icon-wrapper:hover {
          background-color: #121212;
          color: #ffffff;
          border-color: #121212;
          transform: translateY(-3px);
        }

        /* --- Footer Bottom - Bar de Finition --- */
        .footer-bottom {
          margin-top: 100px;
          padding: 40px 50px 0;
          border-top: 1px solid #f5f5f5;
        }

        .bottom-content {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #aaa;
        }

        .legal-links {
          display: flex;
          gap: 30px;
        }

        .legal-links a {
          text-decoration: none;
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s ease;
        }

        .legal-links a:hover { color: ${deepOchre}; }

        @media (max-width: 1024px) {
          .footer-container { 
            grid-template-columns: 1fr 1fr; 
            gap: 50px;
          }
        }

        @media (max-width: 600px) {
          .smart-footer { padding: 80px 0 40px 0; }
          .footer-container { 
            grid-template-columns: 1fr; 
            text-align: center; 
          }
          .section-title::after { left: 50%; transform: translateX(-50%); }
          .social-icons-grid { justify-content: center; }
          .bottom-content { 
            flex-direction: column; 
            gap: 25px; 
          }
          .legal-links { justify-content: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;