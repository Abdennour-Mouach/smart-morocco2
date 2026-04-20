import React from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const deepBlue = "#0E2576";
  const deepOchre = "#CE7B15";
  const softWhite = "#FDF9F4";

  return (
    <footer className="smart-footer">
      <div className="footer-container">
        {/* Identité - Brand Section */}
        <div className="footer-brand">
          <img 
            src="/images/logo.png" 
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
          <h4 className="section-title1">Explorer</h4>
          <ul className="footer-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/packs">Nos Collections</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Conciergerie - Contact */}
        <div className="footer-section">
          <h4 className="section-title1">Conciergerie</h4>
          <div className="contact-details">
            <a href="tel:+2120698653210" className="contact-link">+212 6 98 65 32 10</a>
            <a href="mailto:smartmorocoo@gmail.com" className="contact-link">smartmorocoo@gmail.com</a>
            <p className="address-text">Marrakech, Maroc</p>
          </div>
        </div>

        {/* Social - L'élégance sociale */}
        <div className="footer-section">
          <h4 className="section-title1">Suivez-nous</h4>
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
          background: linear-gradient(145deg, #fefaf5 0%, #fff6ed 100%);
          padding: 100px 0 50px 0;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          border-top: 1px solid rgba(201, 168, 123, 0.2);
          position: relative;
          overflow: hidden;
        }

        /* Élément décoratif (optionnel) */
        .smart-footer::before {
          content: '';
          position: absolute;
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(191, 87, 0, 0.05), transparent);
          border-radius: 50%;
          pointer-events: none;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.8fr 0.8fr 1fr 1fr;
          gap: 80px;
          padding: 0 60px;
          position: relative;
          z-index: 2;
        }

        /* Logo */
        .footer-logo {
          height: 180px;
          margin-bottom: 30px;
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
        }
        .footer-logo:hover {
          transform: translateY(-3px);
        }

        .footer-tagline {
          font-size: 15px;
          color: #5a4a3a;
          line-height: 1.7;
          font-weight: 400;
          letter-spacing: 0.2px;
        }

        .brand-accent {
          color: ${deepOchre};
          font-style: italic;
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-weight: 500;
        }

        /* Titres des sections */
        .section-title1 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 35px;
          color: #2c1a12;
          letter-spacing: 3px;
          position: relative;
          display: inline-block;
        }

        .section-title1::after {
          content: "";
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, ${deepOchre}, #c9a87b);
          transition: width 0.3s ease;
        }

        .footer-section:hover .section-title::after {
          width: 50px;
        }

        /* Liens de navigation */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 16px;
        }

        .footer-links a {
          text-decoration: none;
          color: #6b5a4a;
          font-size: 14px;
          font-weight: 400;
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
        }

        .footer-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: ${deepOchre};
          transition: width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .footer-links a:hover {
          color: #2c1a12;
          transform: translateX(4px);
        }
        .footer-links a:hover::after {
          width: 100%;
        }

        /* Coordonnées */
        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-link {
          font-size: 14px;
          color: #6b5a4a;
          text-decoration: none;
          transition: color 0.3s, transform 0.2s;
          display: inline-block;
        }

        .contact-link:hover {
          color: ${deepBlue};
          transform: translateX(4px);
        }

        .address-text {
          font-size: 13px;
          color: #9b8a7a;
          margin-top: 4px;
          font-style: normal;
        }

        /* Icônes sociales modernisées */
        .social-icons-grid {
          display: flex;
          gap: 18px;
        }

        .icon-wrapper {
          color: #5a4a3a;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(201, 168, 123, 0.3);
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .icon-wrapper:hover {
          background: ${deepOchre};
          border-color: ${deepOchre};
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(206, 123, 21, 0.2);
        }

        /* Footer bottom */
        .footer-bottom {
          margin-top: 80px;
          padding: 35px 60px 0;
          border-top: 1px solid rgba(201, 168, 123, 0.2);
        }

        .bottom-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #9b8a7a;
          font-weight: 400;
        }

        .legal-links {
          display: flex;
          gap: 35px;
        }

        .legal-links a {
          text-decoration: none;
          font-size: 11px;
          color: #9b8a7a;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          position: relative;
        }

        .legal-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${deepOchre};
          transition: width 0.2s;
        }

        .legal-links a:hover {
          color: #2c1a12;
        }
        .legal-links a:hover::after {
          width: 100%;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .footer-container {
            gap: 50px;
            padding: 0 40px;
          }
        }

        @media (max-width: 900px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
          .footer-brand {
            grid-column: span 2;
          }
          .footer-bottom {
            padding: 30px 40px 0;
          }
        }

        @media (max-width: 640px) {
          .smart-footer {
            padding: 70px 0 40px;
          }
          .footer-container {
            grid-template-columns: 1fr;
            gap: 45px;
            text-align: center;
            padding: 0 25px;
          }
          .footer-brand {
            grid-column: auto;
          }
          .section-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          .section-title {
            display: block;
            text-align: center;
          }
          .footer-links a::after {
            left: 50%;
            transform: translateX(-50%);
          }
          .footer-links a:hover {
            transform: translateX(0);
          }
          .contact-link:hover {
            transform: translateX(0);
          }
          .social-icons-grid {
            justify-content: center;
          }
          .bottom-content {
            flex-direction: column;
            text-align: center;
          }
          .legal-links {
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
          }
        }

        /* Animation d'apparition légère */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-container > * {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .footer-container > :nth-child(1) { animation-delay: 0.1s; }
        .footer-container > :nth-child(2) { animation-delay: 0.2s; }
        .footer-container > :nth-child(3) { animation-delay: 0.3s; }
        .footer-container > :nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </footer>
  );
};

export default Footer;