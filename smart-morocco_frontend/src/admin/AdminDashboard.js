import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { 
  LayoutDashboard,
  Mail,
  Edit,
  Eye,
  Trash2,
  Shield,
  Package,
  Hotel,
  Users,
  Star,
  Calendar,
  LogOut,
  Search,
  ChevronRight,
  BarChart3,
  PieChart,
  DollarSign,
  TrendingUp,
  Award,
  MapPin
} from "lucide-react";
import Pack from "./Pack";
import Hebergement from "./Hebergement";
import Restaurant from "./Restaurant";
import Transport from "./Transport";
import Activite from "./Activite";
import Utilisateur from "./utilisateur";
import ContactAdmin from "./Contact";

// Données mock pour le développement
const mockPacks = [
  { id_pack: 1, nom: "Marrakech Découverte", prix: 4500, duree: 5, statut: "actif" },
  { id_pack: 2, nom: "Fès Impérial", prix: 3800, duree: 4, statut: "actif" }
];

const mockHebergements = [
  { id_hebergement: 1, nom: "Riad Marrakech", etoiles: 5, statut: "actif" },
  { id_hebergement: 2, nom: "Hotel Fès", etoiles: 4, statut: "actif" }
];

const mockRestaurants = [
  { id_restaurant: 1, nom: "Dar Zellij", note: 4.8, statut: "actif" }
];

const mockTransports = [
  { id_transport: 1, type: "Train", compagnie: "ONCF", statut: "actif" }
];

const mockEvenements = [
  { id_evenement: 1, titre: "Festival des Roses", date: "2025-05-15", statut: "actif" }
];

const mockUsers = [
  { id_utilisateur: 1, prenom: "Ahmed", nom: "Benali", email: "ahmed@email.com", role: "ROLE_ADMIN" },
  { id_utilisateur: 2, prenom: "Sara", nom: "Ouazzani", email: "sara@email.com", role: "ROLE_USER" }
];

const mockReservations = [
  { id_reservation: 1, client: "Ahmed Benali", pack: "Marrakech Découverte", date: "2025-06-01", montant: 4500, status: "confirmé" },
  { id_reservation: 2, client: "Sara Ouazzani", pack: "Fès Impérial", date: "2025-06-15", montant: 3800, status: "en attente" }
];

const mockReviews = [
  { id_review: 1, client: "Ahmed Benali", pack: "Marrakech Découverte", note: 5, commentaire: "Excellent voyage !", date: "2025-03-20" },
  { id_review: 2, client: "Sara Ouazzani", pack: "Fès Impérial", note: 4, commentaire: "Très bien organisé", date: "2025-03-15" }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [packs, setPacks] = useState([]);
  const [hebergements, setHebergements] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [transports, setTransports] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalPacks: 0,
    totalHebergements: 0,
    totalRestaurants: 0,
    totalTransports: 0,
    totalEvenements: 0,
    totalUsers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fonction de navigation corrigée
  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const role = (parsedUser.role || "").toLowerCase();
      if (role !== "admin" && role !== "role_admin" && role !== "ROLE_ADMIN") {
        window.location.href = "/";
      } else {
        fetchAllData();
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setPacks(mockPacks);
        setHebergements(mockHebergements);
        setRestaurants(mockRestaurants);
        setTransports(mockTransports);
        setEvenements(mockEvenements);
        setUsers(mockUsers);
        setReservations(mockReservations);
        setReviews(mockReviews);

        const totalRevenue = mockReservations
          .filter(r => r.status === "confirmé")
          .reduce((sum, r) => sum + r.montant, 0);
        
        const averageRating = mockReviews.length > 0 
          ? mockReviews.reduce((sum, r) => sum + r.note, 0) / mockReviews.length 
          : 0;

        setStats({
          totalPacks: mockPacks.length,
          totalHebergements: mockHebergements.length,
          totalRestaurants: mockRestaurants.length,
          totalTransports: mockTransports.length,
          totalEvenements: mockEvenements.length,
          totalUsers: mockUsers.length,
          totalReservations: mockReservations.length,
          totalRevenue: totalRevenue,
          averageRating: averageRating.toFixed(1)
        });

        setIsLoading(false);
      }, 1000);
    } catch(e) {
      console.error("Erreur lors du chargement des données :", e);
      setIsLoading(false);
    }
  };

  const getStarRating = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'star-filled' : 'star-empty'}
            fill={star <= rating ? '#ffb84d' : 'none'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    const cls =
      s === "actif" || s === "active" || s === "confirmé" ? "active" :
      s === "inactif" || s === "inactive" ? "inactive" :
      s === "en attente" || s === "pending" ? "pending" : "pending";
    const label =
      s === "actif" || s === "active" ? "Actif" :
      s === "confirmé" ? "Confirmé" :
      s === "inactif" || s === "inactive" ? "Inactif" :
      s === "en attente" || s === "pending" ? "En attente" : (status || "N/A");
    return <span className={`status-badge ${cls}`}>{label}</span>;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
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

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">ⵣ</span>
            <span className="logo-text">Smart<span className="logo-highlight">Morocco</span></span>
          </div>
          <div className="admin-badge">
            <Shield size={16} />
            <span>Administrateur</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/admin')}
          >
            <LayoutDashboard size={20} />
            <span>Tableau de bord</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'packs' ? 'active' : ''}`}
            onClick={() => handleNavigation('packs', '/admin/packs')}
          >
            <Package size={20} />
            <span>Packs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'hebergements' ? 'active' : ''}`}
            onClick={() => handleNavigation('hebergements', '/admin/hebergements')}
          >
            <Hotel size={20} />
            <span>Hébergements</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => handleNavigation('restaurants', '/admin/restaurants')}
          >
            <Award size={20} />
            <span>Restaurants</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'transports' ? 'active' : ''}`}
            onClick={() => handleNavigation('transports', '/admin/transports')}
          >
            <MapPin size={20} />
            <span>Transports</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'activites' ? 'active' : ''}`}
            onClick={() => handleNavigation('activites', '/admin/activites')}
          >
            <TrendingUp size={20} />
            <span>Activités</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleNavigation('users', '/admin/users')}
          >
            <Users size={20} />
            <span>Utilisateurs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavigation('contact', '/admin/contactAdmin')}
          >
            <Mail size={20} />
            <span>Messages</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.prenom} {user?.nom}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content with Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <header className="content-header">
                <h1>Tableau de bord</h1>
                <div className="header-actions">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </header>
              <div className="content-body">
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#0f4c75' }}>
                      <Package size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalPacks}</span>
                      <span className="stat-label">Packs</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#bf5700' }}>
                      <Hotel size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalHebergements}</span>
                      <span className="stat-label">Hébergements</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#28a745' }}>
                      <Users size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalUsers}</span>
                      <span className="stat-label">Clients</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ffc107' }}>
                      <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalReservations}</span>
                      <span className="stat-label">Réservations</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#17a2b8' }}>
                      <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
                      <span className="stat-label">Revenus</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#6f42c1' }}>
                      <Star size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.averageRating}/5</span>
                      <span className="stat-label">Note moyenne</span>
                    </div>
                  </div>
                </div>

                {/* Graphiques */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Revenus mensuels</h3>
                    <div className="chart-placeholder">
                      <BarChart3 size={48} />
                      <p>Graphique des revenus</p>
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Réservations par pack</h3>
                    <div className="chart-placeholder">
                      <PieChart size={48} />
                      <p>Répartition des réservations</p>
                    </div>
                  </div>
                </div>

                {/* Tables récentes */}
                <div className="recent-tables">
                  <div className="recent-card">
                    <div className="card-header">
                      <h3>Réservations récentes</h3>
                      <button className="link-btn" onClick={() => handleNavigation('reservations', '/admin/reservations')}>
                        Voir tout <ChevronRight size={16} />
                      </button>
                    </div>
                    
                  </div>

                  <div className="recent-card">
                    <div className="card-header">
                      <h3>Derniers avis</h3>
                      <button className="link-btn" onClick={() => handleNavigation('reviews', '/admin/reviews')}>
                        Voir tout <ChevronRight size={16} />
                      </button>
                    </div>
                   
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="/packs" element={<Pack />} />
          <Route path="/hebergements" element={<Hebergement />} />
          <Route path="/restaurants" element={<Restaurant />} />
          <Route path="/transports" element={<Transport />} />
          <Route path="/activites" element={<Activite />} />
          <Route path="/users" element={<Utilisateur />} />
          <Route path="/contactAdmin" element={<ContactAdmin />} />
          <Route path="/reservations" element={
            <div className="data-table-container">
              <header className="content-header">
                <h1>Gestion des réservations</h1>
                <div className="header-actions">
                  <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Rechercher..." />
                  </div>
                </div>
              </header>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Pack</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id_reservation}>
                      <td>#{res.id_reservation}</td>
                      <td>{res.client}</td>
                      <td>{res.pack}</td>
                      <td>{formatDate(res.date)}</td>
                      <td className="price">{formatCurrency(res.montant)}</td>
                      <td>{getStatusBadge(res.status)}</td>
                      <td className="actions">
                        <button className="action-btn edit"><Edit size={16} /></button>
                        <button className="action-btn view"><Eye size={16} /></button>
                        <button className="action-btn delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          } />
          <Route path="/reviews" element={
            <div className="data-table-container">
              <header className="content-header">
                <h1>Gestion des avis</h1>
                <div className="header-actions">
                  <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Rechercher..." />
                  </div>
                </div>
              </header>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Pack</th>
                    <th>Note</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(rev => (
                    <tr key={rev.id_review}>
                      <td>#{rev.id_review}</td>
                      <td>{rev.client}</td>
                      <td>{rev.pack}</td>
                      <td>{getStarRating(rev.note)}</td>
                      <td className="comment">{rev.commentaire}</td>
                      <td>{formatDate(rev.date)}</td>
                      <td className="actions">
                        <button className="action-btn edit"><Edit size={16} /></button>
                        <button className="action-btn delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          } />
        </Routes>
      </main>

      <style jsx>{`
        /* Vos styles existants restent identiques */
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-header {
          padding: 25px;
          border-bottom: 1px solid #eaeaea;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .logo-icon {
          font-size: 2rem;
          color: #0f4c75;
        }

        .logo-text {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e272e;
        }

        .logo-highlight {
          color: #0f4c75;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f4c7510;
          color: #0f4c75;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 5px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: #f8f9fa;
          color: #0f4c75;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #1e272e;
        }

        .user-email {
          font-size: 0.8rem;
          color: #999;
        }

        .logout-btn {
          width: 35px;
          height: 35px;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          border-color: #dc3545;
          color: #dc3545;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 30px;
          overflow-x: auto;
        }

        .content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .content-header h1 {
          font-size: 1.8rem;
          color: #1e272e;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 8px 15px;
          border-radius: 50px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .search-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 250px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
        }

        .stat-icon {
          width: 50px;
          height: 50px;
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

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .chart-card h3 {
          margin: 0 0 15px 0;
          color: #1e272e;
        }

        .chart-placeholder {
          height: 200px;
          background: #f8f9fa;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          gap: 10px;
        }

        .recent-tables {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .recent-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .card-header h3 {
          margin: 0;
          color: #1e272e;
        }

        .link-btn {
          background: none;
          border: none;
          color: #0f4c75;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
        }

        .recent-table {
          width: 100%;
          border-collapse: collapse;
        }

        .recent-table th {
          text-align: left;
          padding: 10px;
          font-size: 0.8rem;
          color: #999;
          font-weight: 500;
        }

        .recent-table td {
          padding: 10px;
          border-top: 1px solid #eaeaea;
        }

        .data-table-container {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 15px 10px;
          font-size: 0.9rem;
          color: #666;
          font-weight: 600;
          border-bottom: 2px solid #eaeaea;
        }

        .data-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #eaeaea;
        }

        .data-table tbody tr:hover {
          background: #f8f9fa;
        }

        .price {
          font-weight: 600;
          color: #bf5700;
        }

        .comment {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #666;
        }

        .actions {
          display: flex;
          gap: 5px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.edit:hover {
          background: #0f4c75;
          color: white;
        }

        .action-btn.view:hover {
          background: #17a2b8;
          color: white;
        }

        .action-btn.delete:hover {
          background: #dc3545;
          color: white;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #28a74520;
          color: #28a745;
        }

        .status-badge.inactive {
          background: #dc354520;
          color: #dc3545;
        }

        .status-badge.pending {
          background: #ffc10720;
          color: #ffc107;
        }

        .star-rating {
          display: flex;
          gap: 2px;
        }

        .star-filled {
          color: #ffb84d;
        }

        .star-empty {
          color: #ddd;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-grid,
          .recent-tables {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 0;
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;