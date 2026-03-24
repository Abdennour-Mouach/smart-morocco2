import React, { useState } from "react";
import api from "../services/api";

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
      await api.post("/contacts", formData);
      alert("Merci pour votre message. Nous reviendrons vers vous très prochainement.");
      setFormData({ nom: "", prenom: "", email: "", message: "" });
    } catch (error) {
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  // Les couleurs extraites de ton dégradé
  const deepBlue = "#0E2576"; // Bleu nuit
  const deepOchre = "#CE7B15"; // Ocre orangé
  // Le dégradé linéaire appliqué
  const figmaGradient = `linear-gradient(90deg, ${deepBlue} 0%, ${deepOchre} 100%)`;

  return (
    <div className="contact-wrapper">
      <div className="header-section">
        {/* Titre avec le dégradé spécifique */}
        <h1 className="contact-main-title">Contactez-nous</h1>
        <p className="contact-subtitle">Expertise et élégance pour vos projets de voyage au Maroc.</p>
      </div>
      
      <div className="contact-card">
        {/* Partie Gauche : Composition Visuelle épurée */}
        <div className="visual-container">
          <div className="riad-image-wrapper">
            <img 
              src="https://www.en-vols.com/wp-content/uploads/afmm/2022/12/GettyImages-1294321554_HEADER_Marrakech_local_Michelin.jpg" 
              alt="Marrakech Architecture" 
              className="riad-img" 
            />
            
            {/* iPhone Mockup - Design Ultra-Fine */}
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
        </div>

        {/* Partie Droite : Formulaire Professionnel */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-row">
              <div className="input-field">
                <label>Nom</label>
                <input 
                  type="text" name="nom" placeholder="Ex: El Mansouri" 
                  value={formData.nom} onChange={handleChange} required 
                />
              </div>
              <div className="input-field">
                <label>Prénom</label>
                <input 
                  type="text" name="prenom" placeholder="Ex: Amine" 
                  value={formData.prenom} onChange={handleChange} required 
                />
              </div>
            </div>

            <div className="input-field">
              <label>Adresse mail professionnelle</label>
              <input 
                type="email" name="email" placeholder="votre@email.com" 
                value={formData.email} onChange={handleChange} required 
              />
            </div>

            <div className="input-field">
              <label>Votre Message</label>
              <textarea 
                name="message" placeholder="Décrivez votre projet ou vos besoins..." rows="5"
                value={formData.message} onChange={handleChange} required 
              ></textarea>
            </div>

            {/* Bouton avec le dégradé spécifique appliqué en fond */}
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

      <style jsx>{`
        .contact-wrapper {
          padding: 100px 40px;
          background-color: #fdfdfd;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 1300px;
          margin: 0 auto;
        }

        .header-section {
          text-align: center;
          margin-bottom: 80px;
        }

        /* Titre appliquant le dégradé Figma comme fond et masque de texte */
        .contact-main-title {
          font-size: 52px;
          font-weight: 300;
          margin-bottom: 15px;
          letter-spacing: -1.5px;
          /* Application du dégradé en tant que masque de texte */
          background: ${figmaGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }

        .contact-subtitle {
          font-size: 18px;
          color: #666;
          font-weight: 400;
        }

        .contact-card {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 100px;
          align-items: center;
        }

        /* --- VISUAL SIDE --- */
        .riad-image-wrapper {
          position: relative;
          padding-right: 40px;
        }

        .riad-img {
          width: 100%;
          height: 600px;
          object-fit: cover;
          border-radius: 4px; /* Coins plus carrés pour le côté pro */
          filter: grayscale(15%);
          transition: filter 0.5s;
        }

        .riad-img:hover {
          filter: grayscale(0%);
        }

        .iphone-mockup {
          position: absolute;
          bottom: -40px;
          right: 0;
          width: 240px;
          height: 480px;
          background: #000;
          border: 12px solid #000;
          border-radius: 45px;
          box-shadow: 40px 40px 80px rgba(0,0,0,0.15);
          overflow: hidden;
        }

        .iphone-screen {
          background: #fff;
          height: 100%;
          padding: 25px 15px;
        }

        .iphone-header {
          font-weight: 700;
          font-size: 22px;
          color: #1a1a1a;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .gallery-item {
          margin-bottom: 15px;
          transition: transform 0.3s;
        }

        .gallery-item img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .gallery-item span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 5px;
          color: #888;
        }

        /* --- FORM SIDE --- */
        .modern-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Couleur d'étiquette dérivée de l'ocre pour la cohérence */
        .input-field label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          color: #7b5a3e; /* Ocre plus sombre pour les labels */
        }

        input, textarea {
          padding: 15px 0;
          border: none;
          border-bottom: 1px solid #e0e0e0;
          background: transparent;
          font-size: 16px;
          transition: border-color 0.3s;
          border-radius: 0;
        }

        input:focus, textarea:focus {
          outline: none;
          border-bottom-color: ${deepOchre}; /* Couleur ocre au focus */
        }

        /* Bouton appliquant le dégradé Figma comme fond */
        .submit-btn {
          margin-top: 20px;
          padding: 20px 40px;
          /* Application du dégradé en tant que fond */
          background: ${figmaGradient};
          color: #fff;
          border: none;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(123, 90, 62, 0.2); /* Légère ombre ocre */
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(123, 90, 62, 0.3); /* Ombre plus forte au survol */
        }

        @media (max-width: 1024px) {
          .contact-card {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .riad-img { height: 400px; }
          .iphone-mockup { display: none; }
          .contact-main-title { font-size: 40px; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
