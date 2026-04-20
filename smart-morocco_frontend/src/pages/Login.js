import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ChevronRight, Compass } from "lucide-react";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Liste des images du dossier public/images/
  const images = [
    { src: "/images/Aithaddou.jpg", alt: "Ait Haddou", title: "Ksar Ait Ben Haddou", location: "Vallée de l'Ourika" },
    { src: "/images/Mazagan.jpg", alt: "Mazagan", title: "Mazagan Beach", location: "El Jadida" },
    { src: "/images/Atlas.jpg", alt: "Atlas", title: "Montagnes de l'Atlas", location: "Haut Atlas" },
    { src: "/images/Maalem.jpg", alt: "Maalem", title: "Artisan Maâlem", location: "Fès" },
    { src: "/images/Morocco.jpg", alt: "Morocco", title: "Couleurs du Maroc", location: "Marrakech" }
  ];

  // Changement automatique des images toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await api.post("/api/utilisateurs/login", {
        email,
        mot_de_passe: motDePasse
      });

      setMessage("Connexion réussie !");
      setMessageType("success");
      localStorage.setItem("user", JSON.stringify(res.data));

      setTimeout(() => {
        const role = res?.data?.role;
        window.location.href = role === "ROLE_ADMIN" ? "/admin" : "/";
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data || "Erreur de connexion";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Section Gauche - Formulaire */}
      <div className="login-form-section">
        <div className="form-container">
          {/* Logo */}
          <div>
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="Smart Morocco"
                width="150"
                height="150"
              />
            </Link>
          </div>

          <div className="form-header">
            <h1 className="form-title">Bienvenue</h1>
            <p className="form-subtitle">
              Connectez-vous pour découvrir la magie du Maroc
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Champ Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  style={{ paddingLeft: "50px" }}

                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={motDePasse}
                  style={{ paddingLeft: "50px" }}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Message de statut */}
            {message && (
              <div className={`message ${messageType}`}>
                {messageType === "success" ? "✅" : "❌"} {message}
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Se connecter</span>
                </>
              )}
            </button>

            {/* Lien d'inscription */}
            <p className="register-link">
              Pas encore de compte ? 
              <Link to="/register" className="register-link-text">
                Créer un compte
                <ChevronRight size={16} />
              </Link>
            </p>
          </form>

          {/* Séparateur */}
          <div className="separator">
            <span>Ou continuer avec</span>
          </div>

          {/* Boutons sociaux */}
          <div className="social-buttons">
            <button className="social-btn google">
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Google
            </button>
            <button className="social-btn facebook">
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Section Droite - Carrousel d'images */}
      <div className="image-carousel-section">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentImageIndex ? "active" : ""}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="carousel-image"
            />
            <div className="image-overlay"></div>
            <div className="carousel-content">
              <div className="location-badge">
                <Compass size={16} />
                <span>{image.location}</span>
              </div>
              <h2 className="carousel-title">{image.title}</h2>
              <p className="carousel-description">
                Découvrez les merveilles du Maroc à travers nos yeux
              </p>
            </div>
          </div>
        ))}

        {/* Indicateurs */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? "active" : ""}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Compteur d'images */}
        <div className="image-counter">
          {String(currentImageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>

        {/* Badge de bienvenue */}
        <div className="welcome-badge">
          <span className="badge-text">✨ Bienvenue au Maroc</span>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          display: flex;
          min-height: 100vh;
          background: #faf7f2;
        }

        /* Section Formulaire */
        .login-form-section {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px;
          background: white;
          position: relative;
          overflow-y: auto;
        }

        .form-container {
          max-width: 450px;
          width: 100%;
          padding-top: 10px;
          animation: slideInLeft 0.6s ease;
        }

        /* Logo */

        /* En-tête du formulaire */
        .form-header {
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 10px 0;
        }

        .form-subtitle {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
        }

        /* Formulaire */
        .login-form {
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e272e;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: #999;
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          padding-left: 50px;
          border: 2px solid #eaeaea;
          border-radius: 15px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          outline: none;
          border-color: #0f4c75;
          background: white;
          box-shadow: 0 5px 20px rgba(15, 76, 117, 0.1);
        }

        .form-input:focus + .input-icon {
          color: #0f4c75;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #0f4c75;
        }

        /* Options */
        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #666;
          cursor: pointer;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          accent-color: #0f4c75;
        }

        .forgot-link {
          color: #0f4c75;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #bf5700;
          text-decoration: underline;
        }

        /* Message */
        .message {
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Bouton de soumission */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .submit-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(191, 87, 0, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Loading spinner */
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Lien d'inscription */
        .register-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 0.95rem;
        }

        .register-link-text {
          color: #0f4c75;
          text-decoration: none;
          font-weight: 600;
          margin-left: 5px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: gap 0.3s ease;
        }

        .register-link-text:hover {
          gap: 8px;
          color: #bf5700;
        }

        /* Séparateur */
        .separator {
          text-align: center;
          position: relative;
          margin: 30px 0;
        }

        .separator::before,
        .separator::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 70px);
          height: 1px;
          background: #eaeaea;
        }

        .separator::before {
          left: 0;
        }

        .separator::after {
          right: 0;
        }

        .separator span {
          background: white;
          padding: 0 15px;
          color: #999;
          font-size: 0.9rem;
        }

        /* Boutons sociaux */
        .social-buttons {
          display: flex;
          gap: 15px;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          background: white;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn img {
          width: 20px;
          height: 20px;
        }

        .social-btn.google:hover {
          border-color: #db4437;
          color: #db4437;
        }

        .social-btn.facebook:hover {
          border-color: #4267B2;
          color: #4267B2;
        }

        /* Section Carrousel */
        .image-carousel-section {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .carousel-slide.active {
          opacity: 1;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2),
            rgba(15, 76, 117, 0.6),
            rgba(191, 87, 0, 0.4)
          );
        }

        /* Contenu du carrousel */
        .carousel-content {
          position: absolute;
          bottom: 100px;
          left: 50px;
          right: 50px;
          color: white;
          z-index: 2;
          transform: translateY(20px);
          animation: slideUp 1s ease forwards;
        }

        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .carousel-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .carousel-description {
          font-size: 1rem;
          opacity: 0.9;
          max-width: 400px;
          line-height: 1.6;
        }

        /* Indicateurs */
        .carousel-indicators {
          position: absolute;
          bottom: 30px;
          right: 50px;
          z-index: 3;
          display: flex;
          gap: 10px;
        }

        .indicator {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .indicator.active {
          background: white;
          width: 60px;
        }

        .indicator:hover {
          background: #ffb84d;
        }

        /* Compteur d'images */
        .image-counter {
          position: absolute;
          top: 30px;
          right: 50px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          z-index: 3;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Badge de bienvenue */
        .welcome-badge {
          position: absolute;
          top: 30px;
          left: 50px;
          z-index: 3;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 50px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: float 3s ease-in-out infinite;
        }

        .badge-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Animations */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        /* Responsive */
        @media (max-width: 968px) {
          .login-page {
            flex-direction: column;
          }

          .image-carousel-section {
            display: none;
          }

          .login-form-section {
            padding: 20px;
          }

          .form-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .form-container {
            padding: 20px 0;
          }

          .social-buttons {
            flex-direction: column;
          }

          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
