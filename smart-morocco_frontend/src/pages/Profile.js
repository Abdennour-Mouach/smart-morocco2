import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Award,
  Star,
  Package,
  MessageCircle,
  LogOut,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun
} from "lucide-react";
import api from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Données modifiables
  const [editedUser, setEditedUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  // Statistiques utilisateur
  const [stats, setStats] = useState({
    reservations: 0,
    avis: 0,
    joursVoyages: 0,
    paysVisites: 0,
    badges: []
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      try {
        if (parsedUser.id_utilisateur) {
          const res = await api.get(`/utilisateurs/${parsedUser.id_utilisateur}`);
          const freshUser = res.data;
          setUser(freshUser);
          setEditedUser({
            nom: freshUser.nom || "",
            prenom: freshUser.prenom || "",
            email: freshUser.email || "",
            telephone: freshUser.telephone || ""
          });
          localStorage.setItem("user", JSON.stringify(freshUser));
        } else {
          setUser(parsedUser);
          setEditedUser({
            nom: parsedUser.nom || "",
            prenom: parsedUser.prenom || "",
            email: parsedUser.email || "",
            telephone: parsedUser.telephone || ""
          });
        }
      } catch (error) {
        setUser(parsedUser);
        setEditedUser({
          nom: parsedUser.nom || "",
          prenom: parsedUser.prenom || "",
          email: parsedUser.email || "",
          telephone: parsedUser.telephone || ""
        });
      }
      
      // Simuler le chargement des statistiques
      setStats({
        reservations: 0,
        avis: 0,
        joursVoyages: 0,
        paysVisites: 0,
        badges: [
          { id: 1, name: "Explorateur", icon: <Award size={20} />, color: "#ffb84d" },
          { id: 2, name: "Guide Local", icon: <Star size={20} />, color: "#0f4c75" },
          { id: 3, name: "Photographe", icon: <Camera size={20} />, color: "#bf5700" }
        ]
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Appel API pour mettre à jour le profil
      if (user?.id_utilisateur) {
        await api.put(`/utilisateurs/${user.id_utilisateur}`, editedUser);
      }
      
      // Mettre à jour le localStorage
      const updatedUser = { ...user, ...editedUser };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage("Profil mis à jour avec succès !");
      setMessageType("success");
      setIsEditing(false);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erreur lors de la mise à jour");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
      telephone: user.telephone || "",
     
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setMessage("Veuillez remplir tous les champs du mot de passe");
      setMessageType("error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("La confirmation du mot de passe ne correspond pas");
      setMessageType("error");
      return;
    }
    try {
      if (user?.id_utilisateur) {
        await api.post(`/utilisateurs/${user.id_utilisateur}/password`, {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        });
        setMessage("Mot de passe mis à jour avec succès !");
        setMessageType("success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
      }
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du mot de passe");
      setMessageType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de votre profil...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #faf7f2 0%, #ffffff 100%);
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #eaeaea;
            border-top-color: #0f4c75;
            border-right-color: #bf5700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-prompt">
        <div className="prompt-card">
          <User size={48} className="prompt-icon" />
          <h2>Connectez-vous pour voir votre profil</h2>
          <p>Accédez à vos informations personnelles et gérez votre compte</p>
          <Link to="/login" className="login-btn">
            Se connecter
            <ChevronRight size={18} />
          </Link>
        </div>
        <style jsx>{`
          .login-prompt {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #faf7f2 0%, #ffffff 100%);
            padding: 20px;
          }
          .prompt-card {
            background: white;
            padding: 50px;
            border-radius: 30px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(15, 76, 117, 0.15);
            max-width: 500px;
            animation: fadeInUp 0.6s ease;
          }
          .prompt-icon {
            color: #0f4c75;
            margin-bottom: 20px;
          }
          .prompt-card h2 {
            font-size: 1.8rem;
            color: #1e272e;
            margin-bottom: 15px;
          }
          .prompt-card p {
            color: #666;
            margin-bottom: 30px;
          }
          .login-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 40px;
            background: linear-gradient(135deg, #0f4c75, #bf5700);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .login-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(191, 87, 0, 0.3);
          }
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
        `}</style>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <User size={20} />
            <span>Mon Profil</span>
          </div>
          <h1 className="hero-title">
            Bonjour, <span className="title-highlight">{user.prenom} {user.nom}</span>
          </h1>
          <p className="hero-subtitle">
            Gérez vos informations personnelles et suivez vos aventures
          </p>
        </div>
      </section>

      <div className="container">
        {/* Message de notification */}
        {message && (
          <div className={`notification ${messageType}`}>
            {messageType === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message}</span>
          </div>
        )}

        {/* Cartes de statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.reservations}</span>
              <span className="stat-label">Réservations</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.avis}</span>
              <span className="stat-label">Avis</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.joursVoyages}</span>
              <span className="stat-label">Jours de voyage</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Globe size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.paysVisites}</span>
              <span className="stat-label">Pays visités</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <h3>Mes Badges</h3>
          <div className="badges-grid">
            {stats.badges.map(badge => (
              <div key={badge.id} className="badge-card" style={{ backgroundColor: `${badge.color}20` }}>
                <div className="badge-icon" style={{ color: badge.color }}>
                  {badge.icon}
                </div>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation des tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Informations personnelles
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            Sécurité
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Bell size={18} />
            Préférences
          </button>
        </div>

        {/* Contenu des tabs */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-card">
              <div className="card-header">
                <div className="header-title">
                  <User size={20} />
                  <h2>Informations personnelles</h2>
                </div>
                {!isEditing ? (
                  <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={handleSaveProfile}
                    >
                      <Save size={16} />
                      Enregistrer
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      <X size={16} />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-avatar-section">
                <div className="avatar-container">
                  <div className="avatar">
                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                  </div>
                  <button className="avatar-upload">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="avatar-info">
                  <h3>{user.prenom} {user.nom}</h3>
                  <p>Membre depuis {new Date(user.date_inscription || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nom"
                        value={editedUser.nom}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{user.nom}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="prenom"
                        value={editedUser.prenom}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{user.prenom}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{user.email}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Téléphone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="telephone"
                        value={editedUser.telephone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+212 XXX-XXXXXX"
                      />
                    ) : (
                      <p className="form-value">{user.telephone || "Non renseigné"}</p>
                    )}
                  </div>

                 
                </div>

               

                
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-card">
              <div className="card-header">
                <div className="header-title">
                  <Shield size={20} />
                  <h2>Sécurité du compte</h2>
                </div>
              </div>

              <div className="security-section">
                <h3>Mot de passe</h3>
                <div className="password-field">
                  <Lock size={16} />
                  <input
                    type="password"
                    value="••••••••"
                    disabled
                    className="password-input"
                  />
                  <button
                    className="change-password-btn"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    Changer
                  </button>
                </div>
                {showPasswordForm && (
                  <div className="password-form">
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Mot de passe actuel"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChangeInput}
                      className="form-input"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Nouveau mot de passe"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChangeInput}
                      className="form-input"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmer le nouveau mot de passe"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChangeInput}
                      className="form-input"
                    />
                    <div className="password-actions">
                      <button className="save-btn" onClick={handleChangePassword}>
                        Enregistrer
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
                <p className="password-hint">
                  Dernière modification : il y a 3 mois
                </p>
              </div>

              <div className="security-section">
                <h3>Authentification à deux facteurs</h3>
                <div className="two-factor">
                  <div className="two-factor-info">
                    <Shield size={20} />
                    <div>
                      <p>Protégez votre compte avec une vérification en deux étapes</p>
                      <span className="status-badge inactive">Désactivé</span>
                    </div>
                  </div>
                  <button className="activate-btn">
                    Activer
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h3>Appareils connectés</h3>
                <div className="devices-list">
                  <div className="device-item">
                    <div className="device-info">
                      <Globe size={16} />
                      <div>
                        <p>Chrome sur Windows</p>
                        <span>IP: 192.168.1.1 • Dernière activité: Aujourd'hui</span>
                      </div>
                    </div>
                    <span className="device-status current">Appareil actuel</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-card">
              <div className="card-header">
                <div className="header-title">
                  <Bell size={20} />
                  <h2>Préférences</h2>
                </div>
              </div>

              <div className="preferences-section">
                <h3>Notifications</h3>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <Bell size={16} />
                    <div>
                      <p>Notifications par email</p>
                      <span>Recevez des offres et des actualités</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <MessageCircle size={16} />
                    <div>
                      <p>Réponses aux avis</p>
                      <span>Recevez une notification quand quelqu'un répond à votre avis</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <Package size={16} />
                    <div>
                      <p>Confirmation de réservation</p>
                      <span>Recevez une confirmation par email</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="preferences-section">
                <h3>Langue et région</h3>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <Globe size={16} />
                    <div>
                      <p>Langue</p>
                    </div>
                  </div>
                  <select className="preference-select">
                    <option>Français</option>
                    <option>English</option>
                    <option>العربية</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <Sun size={16} />
                    <div>
                      <p>Thème</p>
                    </div>
                  </div>
                  <div className="theme-toggle">
                    <button className="theme-btn active">
                      <Sun size={16} />
                      Clair
                    </button>
                    <button className="theme-btn">
                      <Moon size={16} />
                      Sombre
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions du compte */}
        <div className="account-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Déconnexion
          </button>
          <button className="delete-btn">
            Supprimer le compte
          </button>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          background: #faf7f2;
          min-height: 100vh;
        }

        /* Hero Section */
        .profile-hero {
          position: relative;
          height: 200px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .title-highlight {
          color: #ffb84d;
        }

        .hero-subtitle {
          font-size: 1rem;
          opacity: 0.9;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Notification */
        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease;
        }

        .notification.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .notification.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e272e;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        /* Badges */
        .badges-section {
          background: white;
          padding: 25px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .badges-section h3 {
          margin: 0 0 20px 0;
          color: #1e272e;
        }

        .badges-grid {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .badge-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 50px;
          background: #f8f9fa;
        }

        .badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-name {
          font-weight: 500;
          color: #1e272e;
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: white;
          padding: 10px;
          border-radius: 50px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          border-radius: 40px;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
        }

        /* Profile Card */
        .profile-card,
        .security-card,
        .preferences-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eaeaea;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #1e272e;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          background: white;
          color: #0f4c75;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-btn:hover {
          border-color: #0f4c75;
        }

        .edit-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn,
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        /* Avatar */
        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .avatar-upload {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 30px;
          height: 30px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f4c75;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .avatar-upload:hover {
          transform: scale(1.1);
          background: #0f4c75;
          color: white;
        }

        .avatar-info h3 {
          margin: 0 0 5px 0;
          color: #1e272e;
        }

        .avatar-info p {
          margin: 0;
          color: #666;
        }

        /* Form */
        .profile-form {
          max-width: 600px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e272e;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0f4c75;
          background: white;
        }

        .form-value {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 12px;
          color: #1e272e;
          margin: 0;
        }

        .form-value.bio {
          white-space: pre-wrap;
          line-height: 1.6;
        }

        /* Security Section */
        .security-section {
          margin-bottom: 30px;
        }

        .security-section h3 {
          color: #1e272e;
          margin-bottom: 15px;
        }

        .password-field {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f9fa;
          padding: 10px;
          border-radius: 12px;
        }

        .password-form {
          margin-top: 15px;
          display: grid;
          gap: 10px;
        }

        .password-actions {
          display: flex;
          gap: 10px;
        }

        .password-input {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          color: #666;
        }

        .change-password-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid #0f4c75;
          border-radius: 8px;
          color: #0f4c75;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .change-password-btn:hover {
          background: #0f4c75;
          color: white;
        }

        .password-hint {
          font-size: 0.9rem;
          color: #999;
          margin-top: 5px;
        }

        .two-factor {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
        }

        .two-factor-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .two-factor-info p {
          margin: 0 0 5px 0;
          color: #1e272e;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.inactive {
          background: #ffc10720;
          color: #ffc107;
        }

        .activate-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .activate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        .devices-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
        }

        .device-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .device-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .device-info p {
          margin: 0 0 5px 0;
          font-weight: 600;
        }

        .device-info span {
          font-size: 0.8rem;
          color: #999;
        }

        .device-status {
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .device-status.current {
          background: #28a74520;
          color: #28a745;
        }

        /* Preferences */
        .preferences-section {
          margin-bottom: 30px;
        }

        .preferences-section h3 {
          color: #1e272e;
          margin-bottom: 15px;
        }

        .preference-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .preference-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .preference-info p {
          margin: 0 0 5px 0;
          font-weight: 600;
        }

        .preference-info span {
          font-size: 0.8rem;
          color: #999;
        }

        .preference-select {
          padding: 8px 12px;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .theme-toggle {
          display: flex;
          gap: 5px;
        }

        .theme-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-btn.active {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        /* Switch Toggle */
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background: linear-gradient(90deg, #0f4c75, #bf5700);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        /* Account Actions */
        .account-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }

        .logout-btn,
        .delete-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn {
          background: #f8f9fa;
          color: #1e272e;
          border: 2px solid #eaeaea;
        }

        .logout-btn:hover {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        /* Animations */
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

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .profile-avatar-section {
            flex-direction: column;
            text-align: center;
          }

          .profile-tabs {
            flex-direction: column;
            border-radius: 20px;
          }

          .account-actions {
            flex-direction: column;
            gap: 10px;
          }

          .hero-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
