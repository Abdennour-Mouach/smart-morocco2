import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Compass,
  Check,
  AlertCircle
} from "lucide-react";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    ville: "",
    motDePasse: "",
    confirmMotDePasse: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Villes du Maroc pour le select
  const villesMaroc = [
    "Casablanca", "Rabat", "Fès", "Marrakech", "Tanger", "Agadir",
    "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "Mohammedia",
    "El Jadida", "Béni Mellal", "Nador", "Taza", "Settat", "Larache",
    "Khemisset", "Guelmim", "Berrechid", "Ouarzazate", "Essaouira",
    "Chefchaouen", "Tiznit", "Al Hoceïma", "Taourirt", "Sidi Kacem"
  ];

  // Lecture automatique de la vidéo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Lecture automatique impossible:", error);
      });
    }
  }, []);

  // Calculer la force du mot de passe
  useEffect(() => {
    let strength = 0;
    const password = formData.motDePasse;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.motDePasse]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validation des mots de passe
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setMessage("Les mots de passe ne correspondent pas");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    // Validation de la force du mot de passe
    if (passwordStrength < 50) {
      setMessage("Le mot de passe est trop faible");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    // Validation des conditions d'utilisation
    if (!acceptedTerms) {
      setMessage("Veuillez accepter les conditions d'utilisation");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si l'email existe déjà
      const checkEmail = await api.get(`/utilisateurs/email/${formData.email}`);
      if (checkEmail.data) {
        setMessage("Cet email est déjà utilisé");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      // L'email n'existe pas, on peut continuer
    }

    try {
      // Créer le nouvel utilisateur
      const newUser = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        ville: formData.ville,
        mot_de_passe: formData.motDePasse,
        date_inscription: new Date().toISOString(),
        role: "client"
      };

      await api.post("/utilisateurs", newUser);
      
      setMessage("Inscription réussie ! Redirection...");
      setMessageType("success");
      
      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Section Gauche - Vidéo de fond */}
      <div className="video-section">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`background-video ${isVideoLoaded ? 'loaded' : ''}`}
        >
          <source src="/videos/Mamounia.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
        <div className="video-overlay"></div>
        
        {/* Contenu superposé à la vidéo */}
        <div className="video-content">
          <div className="welcome-badge">
            <span className="badge-text">✨ La Mamounia</span>
          </div>
          
          <h1 className="video-title">
            L'Art de Vivre<br />
            <span className="title-highlight">à la Marocaine</span>
          </h1>
          
          <p className="video-description">
            Découvrez l'élégance intemporelle et le luxe discret du mythique palace 
            La Mamounia, joyau de Marrakech depuis 1923
          </p>
          
          <div className="video-stats">
            <div className="stat-item">
              <span className="stat-value">1923</span>
              <span className="stat-label">Année de création</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5★</span>
              <span className="stat-label">Palace légendaire</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">∞</span>
              <span className="stat-label">Élégance intemporelle</span>
            </div>
          </div>
        </div>

        {/* Indicateur de défilement */}
        <div className="scroll-indicator">
          <span>Découvrir</span>
          <div className="scroll-icon"></div>
        </div>
      </div>

      {/* Section Droite - Formulaire */}
      <div className="register-form-section">
        <div className="form-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">ⵣ</span>
            <span className="logo-text">Smart<span className="logo-highlight">Morocco</span></span>
          </Link>

          <div className="form-header">
            <h1 className="form-title">Créer un compte</h1>
            <p className="form-subtitle">
              Rejoignez notre communauté de voyageurs et découvrez le Maroc autrement
            </p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            {/* Nom et Prénom */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">Nom</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prenom" className="form-label">Prénom</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Adresse email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label htmlFor="telephone" className="form-label">Téléphone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="+212 XXX-XXXXXX"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Ville */}
            <div className="form-group">
              <label htmlFor="ville" className="form-label">Ville</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <select
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="form-input form-select"
                >
                  <option value="">Sélectionnez votre ville</option>
                  {villesMaroc.map((ville) => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="motDePasse" className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.motDePasse}
                  onChange={handleChange}
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
              
              {/* Indicateur de force du mot de passe */}
              {formData.motDePasse && (
                <div className="password-strength">
                  <div className="strength-bars">
                    <div className={`strength-bar ${passwordStrength >= 25 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 50 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 75 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 100 ? 'active' : ''}`}></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength < 25 && "Faible"}
                    {passwordStrength >= 25 && passwordStrength < 50 && "Moyen"}
                    {passwordStrength >= 50 && passwordStrength < 75 && "Bon"}
                    {passwordStrength >= 75 && "Fort"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div className="form-group">
              <label htmlFor="confirmMotDePasse" className="form-label">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="confirmMotDePasse"
                  name="confirmMotDePasse"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Indicateur de correspondance */}
              {formData.confirmMotDePasse && (
                <div className="password-match">
                  {formData.motDePasse === formData.confirmMotDePasse ? (
                    <span className="match-success">
                      <Check size={14} /> Les mots de passe correspondent
                    </span>
                  ) : (
                    <span className="match-error">
                      <AlertCircle size={14} /> Les mots de passe ne correspondent pas
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Conditions d'utilisation */}
            <div className="terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="checkbox"
                />
                <span>
                  J'accepte les{" "}
                  <Link to="/terms" className="terms-link">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="/privacy" className="terms-link">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
            </div>

            {/* Message de statut */}
            {message && (
              <div className={`message ${messageType}`}>
                {messageType === "success" ? "✅" : "❌"} {message}
              </div>
            )}

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <User size={20} />
                  <span>S'inscrire</span>
                </>
              )}
            </button>

            {/* Lien de connexion */}
            <p className="login-link">
              Déjà un compte ? 
              <Link to="/login" className="login-link-text">
                Se connecter
                <ChevronRight size={16} />
              </Link>
            </p>
          </form>

          {/* Séparateur */}
          <div className="separator">
            <span>Ou s'inscrire avec</span>
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

      <style jsx>{`
        .register-page {
          display: flex;
          min-height: 100vh;
          background: #faf7f2;
        }

        /* Section Vidéo */
        .video-section {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.5s ease;
        }

        .background-video.loaded {
          opacity: 1;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(15, 76, 117, 0.6) 0%,
            rgba(191, 87, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
          z-index: 1;
        }

        .video-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 500px;
          padding: 40px;
          animation: fadeInUp 1s ease;
        }

        .welcome-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: float 3s ease-in-out infinite;
        }

        .video-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .title-highlight {
          color: #ffb84d;
          position: relative;
        }

        .title-highlight::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #ffb84d, #bf5700);
          border-radius: 2px;
        }

        .video-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .video-stats {
          display: flex;
          gap: 30px;
          margin-top: 40px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffb84d;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          text-align: center;
          color: white;
          font-size: 0.9rem;
          animation: bounce 2s infinite;
        }

        .scroll-icon {
          width: 30px;
          height: 50px;
          border: 2px solid white;
          border-radius: 25px;
          margin: 10px auto 0;
          position: relative;
        }

        .scroll-icon::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 8px;
          background: white;
          border-radius: 2px;
          animation: scroll 2s infinite;
        }

        /* Section Formulaire */
        .register-form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: white;
          overflow-y: auto;
        }

        .form-container {
          max-width: 550px;
          width: 100%;
          animation: slideInRight 0.6s ease;
        }

        /* Logo */
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 30px;
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
          background: linear-gradient(90deg, #0f4c75, #bf5700);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .logo:hover .logo-highlight::after {
          transform: scaleX(1);
        }

        /* En-tête du formulaire */
        .form-header {
          margin-bottom: 30px;
        }

        .form-title {
          font-size: 2.2rem;
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
        .register-form {
          margin-bottom: 30px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
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
          padding: 12px 15px 12px 45px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          font-size: 0.95rem;
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

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
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

        /* Force du mot de passe */
        .password-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .strength-bars {
          display: flex;
          gap: 5px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: #eaeaea;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.active {
          background: linear-gradient(90deg, #0f4c75, #bf5700);
        }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 60px;
          color: #666;
        }

        /* Correspondance mot de passe */
        .password-match {
          margin-top: 8px;
          font-size: 0.85rem;
        }

        .match-success {
          color: #28a745;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .match-error {
          color: #dc3545;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Conditions d'utilisation */
        .terms-group {
          margin-bottom: 20px;
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
          border-radius: 4px;
          cursor: pointer;
          accent-color: #0f4c75;
        }

        .terms-link {
          color: #0f4c75;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          color: #bf5700;
          text-decoration: underline;
        }

        /* Message */
        .message {
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
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
          padding: 14px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 12px;
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

        /* Lien de connexion */
        .login-link {
          text-align: center;
          margin-top: 15px;
          color: #666;
          font-size: 0.95rem;
        }

        .login-link-text {
          color: #0f4c75;
          text-decoration: none;
          font-weight: 600;
          margin-left: 5px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: gap 0.3s ease;
        }

        .login-link-text:hover {
          gap: 8px;
          color: #bf5700;
        }

        /* Séparateur */
        .separator {
          text-align: center;
          position: relative;
          margin: 25px 0;
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

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
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

        @keyframes scroll {
          0% { top: 8px; opacity: 1; }
          50% { top: 25px; opacity: 0.5; }
          100% { top: 8px; opacity: 1; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-20px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        /* Responsive */
        @media (max-width: 968px) {
          .register-page {
            flex-direction: column-reverse;
          }

          .video-section {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .register-form-section {
            padding: 20px;
          }

          .form-title {
            font-size: 1.8rem;
          }

          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;