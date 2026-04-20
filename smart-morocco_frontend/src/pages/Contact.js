import React, { useState } from "react";
import api from "../services/api";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/contacts", formData);
      alert("Merci pour votre message. Nous reviendrons vers vous très prochainement.");
      setFormData({ nom: "", prenom: "", email: "", message: "" });
    } catch (error) {
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  const deepBlue = "#0E2576";
  const deepOchre = "#CE7B15";
  const figmaGradient = `linear-gradient(135deg, ${deepBlue} 0%, ${deepOchre} 100%)`;

  return (
    <div className="contact-page">
      <div className="bg-ornament"></div>
      <div className="bg-pattern"></div>

      <div className="contact-container">
        <div className="header-section">
          <span className="section-subtitle">Prenez contact</span>
          <h1 className="contact-main-title">Échangeons ensemble</h1>
          <div className="title-decoration">
            <span className="decoration-line"></span>
            <span className="decoration-dot"></span>
            <span className="decoration-line"></span>
          </div>
          <p className="contact-subtitle">
            Une expertise sur mesure pour vos projets de voyage au Maroc.
          </p>
        </div>

        <div className="contact-card">
          <div className="visual-container">
            <div className="video-wrapper">
              <video
                className="hero-video"
                src="/videos/Morocco.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="video-overlay"></div>
            </div>
            <div className="iphone-mockup">
              <div className="iphone-screen">
                <div className="iphone-header">Exploration</div>
                <div className="gallery-scroll">
                  {[
                    { name: "Chefchaouen", url: "https://www.muchbetteradventures.com/magazine/content/images/2022/09/Chefchaouen-2-1.jpg" },
                    { name: "Casablanca", url: "https://media.istockphoto.com/id/1282606692/fr/photo/vue-du-soir-du-paysage-urbain-de-casablanca-avec-la-mosqu%C3%A9e-hassan-ii-au-maroc.webp?a=1&b=1&s=612x612&w=0&k=20&c=GIeTyI9b42Pot02Jhz83Xi8cS1i4G5UdvMROvcGlN24=" },
                    { name: "Fès", url: "https://tse2.mm.bing.net/th/id/OIP.A6SojANlHiA9BXDIzQWMggHaFc?rs=1&pid=ImgDetMain&o=7&rm=3" }
                  ].map((dest, i) => (
                    <div className="gallery-item" key={i}>
                      <img src={dest.url} alt={dest.name} />
                      <span>{dest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-row">
                <div className="input-field">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="El Mansouri"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Amine"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Adresse email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Votre message</label>
                <textarea
                  name="message"
                  placeholder="Décrivez votre projet ou vos besoins..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span>Envoyer la demande</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .contact-page {
          background: linear-gradient(145deg, #fdf9f4 0%, #fff6ed 100%);
          padding: 140px 20px 100px;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .bg-ornament {
          position: absolute;
          top: 5%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(191, 87, 0, 0.06) 0%, rgba(191, 87, 0, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .bg-pattern {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" opacity="0.03"><path fill="none" stroke="%238b6b42" stroke-width="1" d="M70 30 L30 70 L70 110 L110 70 Z M130 90 L90 130 L130 170 L170 130 Z M40 140 L20 160 L40 180 L60 160 Z M150 40 L130 60 L150 80 L170 60 Z"/><circle cx="100" cy="100" r="8" fill="%238b6b42"/></svg>');
          background-repeat: repeat;
          background-size: 40px;
          pointer-events: none;
          z-index: 0;
        }

        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .header-section {
          text-align: center;
          margin-bottom: 70px;
        }

        .section-subtitle {
          display: inline-block;
          color: #b45f2b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 0.85rem;
          background: rgba(191, 87, 0, 0.08);
          padding: 6px 18px;
          border-radius: 40px;
          backdrop-filter: blur(2px);
          margin-bottom: 20px;
        }

        .contact-main-title {
          font-size: 3.2rem;
          font-weight: 600;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
          background: ${figmaGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Playfair Display', 'Times New Roman', serif;
        }

        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 16px 0 20px;
        }

        .decoration-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, #c9a87b, #9e7b53);
          border-radius: 2px;
        }

        .decoration-dot {
          width: 8px;
          height: 8px;
          background: #bf5700;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(191, 87, 0, 0.2);
        }

        .contact-subtitle {
          font-size: 1.1rem;
          color: #5a4a3a;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          background: rgba(255, 250, 245, 0.75);
          backdrop-filter: blur(12px);
          border-radius: 48px;
          padding: 50px 60px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(255, 245, 235, 0.9);
          transition: all 0.4s ease;
        }

        .contact-card:hover {
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
          border-color: rgba(201, 168, 123, 0.3);
        }

        .visual-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .video-wrapper {
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .hero-video {
          width: 100%;
          height: 350px;          /* Hauteur ajoutée */
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .video-wrapper:hover .hero-video {
          transform: scale(1.02);
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, rgba(14, 37, 118, 0.1), rgba(206, 123, 21, 0.1));
          pointer-events: none;
        }

        .iphone-mockup {
          position: absolute;
          bottom: -30px;
          right: -20px;
          width: 220px;
          height: 440px;
          background: #1a1a1a;
          border-radius: 40px;
          border: 6px solid #2c2c2c;
          box-shadow: 20px 30px 40px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          backdrop-filter: blur(4px);
          transition: transform 0.3s ease;
        }

        .iphone-mockup:hover {
          transform: translateY(-6px);
        }

        .iphone-screen {
          background: #fffaf5;
          height: 100%;
          padding: 20px 12px;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .iphone-header {
          font-weight: 600;
          font-size: 18px;
          color: #2c1a12;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e9dfd3;
          font-family: 'Inter', sans-serif;
        }

        .gallery-item {
          margin-bottom: 16px;
          transition: transform 0.2s;
        }

        .gallery-item img {
          width: 100%;
          height: 70px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }

        .gallery-item span {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 6px;
          color: #8b735a;
          font-weight: 500;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .modern-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 600;
          color: #8b6b42;
        }

        input, textarea {
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #e2d5c8;
          background: transparent;
          font-size: 16px;
          transition: all 0.3s;
          border-radius: 0;
          color: #2c1a12;
        }

        input:focus, textarea:focus {
          outline: none;
          border-bottom-color: #bf5700;
        }

        textarea {
          resize: vertical;
        }

        .submit-btn {
          margin-top: 20px;
          padding: 16px 32px;
          background: ${figmaGradient};
          color: white;
          border: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 40px;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          box-shadow: 0 8px 20px rgba(123, 90, 62, 0.2);
          width: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(123, 90, 62, 0.3);
          filter: brightness(1.02);
        }

        @media (max-width: 1100px) {
          .contact-card {
            padding: 45px;
            gap: 50px;
          }
          .contact-main-title {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 900px) {
          .contact-page {
            padding: 100px 20px 80px;
          }
          .contact-card {
            grid-template-columns: 1fr;
            gap: 50px;
            padding: 40px 35px;
          }
          .visual-container {
            max-width: 500px;
            margin: 0 auto;
          }
          .hero-video {
            height: 320px; /* Hauteur adaptée */
          }
          .iphone-mockup {
            display: none;
          }
          .contact-main-title {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 640px) {
          .contact-card {
            padding: 30px 20px;
            border-radius: 36px;
          }
          .input-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .hero-video {
            height: 240px; /* Hauteur adaptée mobile */
          }
          .contact-main-title {
            font-size: 2rem;
          }
          .section-subtitle {
            font-size: 0.75rem;
          }
          .title-decoration .decoration-line {
            width: 35px;
          }
          .submit-btn {
            padding: 14px 24px;
            font-size: 12px;
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-card {
          animation: fadeSlideUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;