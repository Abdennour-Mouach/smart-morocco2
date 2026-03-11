import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard,
  Shield,
  User,
  Save,
  Package,
  Hotel,
  Users,
  Star,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import api from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [packs, setPacks] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalPacks: 0,
    totalHotels: 0,
    totalUsers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  // Vérifier si l'utilisateur est admin
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Vérifier si l'utilisateur est admin
      if (parsedUser.role !== "admin") {
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
      // Simuler des données pour l'exemple
      setTimeout(() => {
        const mockPacks = [
          { id_pack: 1, nom_pack: "Circuit Impérial", prix: 890, duree: "7 jours", destination: "Marrakech, Fès, Meknès, Rabat", status: "actif", reservations: 45, note: 4.8 },
          { id_pack: 2, nom_pack: "Sahara Adventure", prix: 650, duree: "5 jours", destination: "Merzouga", status: "actif", reservations: 38, note: 4.9 },
          { id_pack: 3, nom_pack: "Escapade à Chefchaouen", prix: 450, duree: "4 jours", destination: "Chefchaouen", status: "actif", reservations: 52, note: 5.0 },
          { id_pack: 4, nom_pack: "Détente à Agadir", prix: 550, duree: "6 jours", destination: "Agadir", status: "inactif", reservations: 12, note: 4.5 },
        ];

        const mockHotels = [
          { id_hotel: 1, nom: "La Mamounia", ville: "Marrakech", prix_nuit: 1200, etoiles: 5, chambres: 50, status: "actif" },
          { id_hotel: 2, nom: "Riad Fès", ville: "Fès", prix_nuit: 450, etoiles: 4, chambres: 25, status: "actif" },
          { id_hotel: 3, nom: "Hôtel Atlas", ville: "Casablanca", prix_nuit: 380, etoiles: 4, chambres: 80, status: "actif" },
          { id_hotel: 4, nom: "Desert Luxury Camp", ville: "Merzouga", prix_nuit: 650, etoiles: 5, chambres: 15, status: "actif" },
        ];

        const mockUsers = [
          { id_utilisateur: 1, nom: "Martin", prenom: "Sophie", email: "sophie.m@email.com", role: "client", reservations: 3, date_inscription: "2024-01-15" },
          { id_utilisateur: 2, nom: "Anderson", prenom: "Thomas", email: "thomas.a@email.com", role: "client", reservations: 2, date_inscription: "2024-02-01" },
          { id_utilisateur: 3, nom: "Alaoui", prenom: "Fatima", email: "fatima.a@email.com", role: "client", reservations: 5, date_inscription: "2023-12-10" },
          { id_utilisateur: 4, nom: "Admin", prenom: "System", email: "admin@smartmorocco.com", role: "admin", reservations: 0, date_inscription: "2023-01-01" },
        ];

        const mockReservations = [
          { id_reservation: 1, client: "Sophie Martin", pack: "Circuit Impérial", date: "2024-03-15", montant: 890, status: "confirmé" },
          { id_reservation: 2, client: "Thomas Anderson", pack: "Sahara Adventure", date: "2024-03-20", montant: 650, status: "en attente" },
          { id_reservation: 3, client: "Fatima Alaoui", pack: "Escapade à Chefchaouen", date: "2024-03-10", montant: 450, status: "confirmé" },
          { id_reservation: 4, client: "Sophie Martin", pack: "Sahara Adventure", date: "2024-04-01", montant: 650, status: "confirmé" },
        ];

        const mockReviews = [
          { id_review: 1, client: "Sophie Martin", pack: "Circuit Impérial", note: 5, commentaire: "Magnifique voyage !", date: "2024-02-15" },
          { id_review: 2, client: "Thomas Anderson", pack: "Sahara Adventure", note: 5, commentaire: "Inoubliable !", date: "2024-02-20" },
          { id_review: 3, client: "Fatima Alaoui", pack: "Escapade à Chefchaouen", note: 4, commentaire: "Très beau séjour", date: "2024-02-10" },
        ];

        setPacks(mockPacks);
        setHotels(mockHotels);
        setUsers(mockUsers);
        setReservations(mockReservations);
        setReviews(mockReviews);

        // Calculer les statistiques
        const totalRevenue = mockReservations
          .filter(r => r.status === "confirmé")
          .reduce((sum, r) => sum + r.montant, 0);
        
        const avgRating = mockReviews.reduce((sum, r) => sum + r.note, 0) / mockReviews.length;

        setStats({
          totalPacks: mockPacks.length,
          totalHotels: mockHotels.length,
          totalUsers: mockUsers.filter(u => u.role === "client").length,
          totalReservations: mockReservations.length,
          totalRevenue,
          averageRating: avgRating.toFixed(1)
        });

        setIsLoading(false);
      }, 1000);

      // Version réelle avec API :
      // const [packsRes, hotelsRes, usersRes, reservationsRes, reviewsRes] = await Promise.all([
      //   api.get("/admin/packs"),
      //   api.get("/admin/hotels"),
      //   api.get("/admin/users"),
      //   api.get("/admin/reservations"),
      //   api.get("/admin/reviews")
      // ]);
      // setPacks(packsRes.data);
      // setHotels(hotelsRes.data);
      // setUsers(usersRes.data);
      // setReservations(reservationsRes.data);
      // setReviews(reviewsRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setIsLoading(false);
    }
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      // Logique de suppression
      if (type === "pack") {
        setPacks(packs.filter(p => p.id_pack !== id));
      } else if (type === "hotel") {
        setHotels(hotels.filter(h => h.id_hotel !== id));
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "actif":
      case "confirmé":
        return <span className="status-badge active"><CheckCircle size={14} /> Actif</span>;
      case "inactif":
        return <span className="status-badge inactive"><XCircle size={14} /> Inactif</span>;
      case "en attente":
        return <span className="status-badge pending"><Clock size={14} /> En attente</span>;
      default:
        return <span className="status-badge">{status}</span>;
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
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Tableau de bord</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'packs' ? 'active' : ''}`}
            onClick={() => setActiveTab('packs')}
          >
            <Package size={20} />
            <span>Packs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Hotel size={20} />
            <span>Hôtels</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>Utilisateurs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <Calendar size={20} />
            <span>Réservations</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={20} />
            <span>Avis</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Paramètres</span>
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

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'dashboard' && 'Tableau de bord'}
            {activeTab === 'packs' && 'Gestion des packs'}
            {activeTab === 'hotels' && 'Gestion des hôtels'}
            {activeTab === 'users' && 'Gestion des utilisateurs'}
            {activeTab === 'reservations' && 'Gestion des réservations'}
            {activeTab === 'reviews' && 'Gestion des avis'}
            {activeTab === 'settings' && 'Paramètres'}
          </h1>
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
            {(activeTab === 'packs' || activeTab === 'hotels') && (
              <button className="add-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                Ajouter
              </button>
            )}
          </div>
        </header>

        <div className="content-body">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <>
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
                    <span className="stat-value">{stats.totalHotels}</span>
                    <span className="stat-label">Hôtels</span>
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
                    <Link to="#" onClick={() => setActiveTab('reservations')}>
                      Voir tout <ChevronRight size={16} />
                    </Link>
                  </div>
                  <table className="recent-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Pack</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 3).map(res => (
                        <tr key={res.id_reservation}>
                          <td>{res.client}</td>
                          <td>{res.pack}</td>
                          <td>{formatDate(res.date)}</td>
                          <td>{formatCurrency(res.montant)}</td>
                          <td>{getStatusBadge(res.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="recent-card">
                  <div className="card-header">
                    <h3>Derniers avis</h3>
                    <Link to="#" onClick={() => setActiveTab('reviews')}>
                      Voir tout <ChevronRight size={16} />
                    </Link>
                  </div>
                  <table className="recent-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Pack</th>
                        <th>Note</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.slice(0, 3).map(rev => (
                        <tr key={rev.id_review}>
                          <td>{rev.client}</td>
                          <td>{rev.pack}</td>
                          <td>{getStarRating(rev.note)}</td>
                          <td>{formatDate(rev.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Packs Management */}
          {activeTab === 'packs' && (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom du pack</th>
                    <th>Destination</th>
                    <th>Durée</th>
                    <th>Prix</th>
                    <th>Réservations</th>
                    <th>Note</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packs
                    .filter(p => p.nom_pack.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(pack => (
                      <tr key={pack.id_pack}>
                        <td>#{pack.id_pack}</td>
                        <td className="pack-name">
                          <Package size={16} />
                          {pack.nom_pack}
                        </td>
                        <td>
                          <MapPin size={14} />
                          {pack.destination}
                        </td>
                        <td>{pack.duree}</td>
                        <td className="price">{formatCurrency(pack.prix)}</td>
                        <td>{pack.reservations}</td>
                        <td>{getStarRating(pack.note)}</td>
                        <td>{getStatusBadge(pack.status)}</td>
                        <td className="actions">
                          <button className="action-btn edit" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn view" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Supprimer"
                            onClick={() => handleDelete("pack", pack.id_pack)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Hotels Management */}
          {activeTab === 'hotels' && (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom de l'hôtel</th>
                    <th>Ville</th>
                    <th>Étoiles</th>
                    <th>Prix/Nuit</th>
                    <th>Chambres</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels
                    .filter(h => h.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(hotel => (
                      <tr key={hotel.id_hotel}>
                        <td>#{hotel.id_hotel}</td>
                        <td className="hotel-name">
                          <Hotel size={16} />
                          {hotel.nom}
                        </td>
                        <td>
                          <MapPin size={14} />
                          {hotel.ville}
                        </td>
                        <td>{getStarRating(hotel.etoiles)}</td>
                        <td className="price">{formatCurrency(hotel.prix_nuit)}</td>
                        <td>{hotel.chambres}</td>
                        <td>{getStatusBadge(hotel.status)}</td>
                        <td className="actions">
                          <button className="action-btn edit" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn view" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Supprimer"
                            onClick={() => handleDelete("hotel", hotel.id_hotel)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Réservations</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => `${u.prenom} ${u.nom}`.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(user => (
                      <tr key={user.id_utilisateur}>
                        <td>#{user.id_utilisateur}</td>
                        <td className="user-name">
                          <Users size={16} />
                          {user.prenom} {user.nom}
                        </td>
                        <td>
                          <Mail size={14} />
                          {user.email}
                        </td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                            {user.role}
                          </span>
                        </td>
                        <td>{user.reservations}</td>
                        <td>{formatDate(user.date_inscription)}</td>
                        <td className="actions">
                          <button className="action-btn edit" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn view" title="Voir">
                            <Eye size={16} />
                          </button>
                          {user.role !== 'admin' && (
                            <button className="action-btn delete" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reservations Management */}
          {activeTab === 'reservations' && (
            <div className="data-table-container">
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
                  {reservations
                    .filter(r => r.client.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(res => (
                      <tr key={res.id_reservation}>
                        <td>#{res.id_reservation}</td>
                        <td className="client-name">
                          <Users size={16} />
                          {res.client}
                        </td>
                        <td>{res.pack}</td>
                        <td>{formatDate(res.date)}</td>
                        <td className="price">{formatCurrency(res.montant)}</td>
                        <td>{getStatusBadge(res.status)}</td>
                        <td className="actions">
                          <button className="action-btn edit" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn view" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn delete" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Management */}
          {activeTab === 'reviews' && (
            <div className="data-table-container">
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
                  {reviews
                    .filter(r => r.client.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(rev => (
                      <tr key={rev.id_review}>
                        <td>#{rev.id_review}</td>
                        <td className="client-name">
                          <Users size={16} />
                          {rev.client}
                        </td>
                        <td>{rev.pack}</td>
                        <td>{getStarRating(rev.note)}</td>
                        <td className="comment">{rev.commentaire}</td>
                        <td>{formatDate(rev.date)}</td>
                        <td className="actions">
                          <button className="action-btn edit" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn delete" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="settings-container">
              <div className="settings-section">
                <h3>Paramètres généraux</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Nom du site</label>
                    <input type="text" value="Smart Morocco" className="settings-input" />
                  </div>
                  <div className="form-group">
                    <label>Email de contact</label>
                    <input type="email" value="contact@smartmorocco.com" className="settings-input" />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" value="+212 5XX-XXXXXX" className="settings-input" />
                  </div>
                  <div className="form-group">
                    <label>Devise</label>
                    <select className="settings-select">
                      <option>MAD</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Commission</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Taux de commission (%)</label>
                    <input type="number" value="15" className="settings-input" />
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Emails automatiques</h3>
                <div className="settings-toggle">
                  <div className="toggle-item">
                    <span>Confirmation de réservation</span>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <span>Rappel de voyage</span>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <span>Newsletter</span>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <button className="save-settings-btn">
                <Save size={18} />
                Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
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

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 30px;
        }

        .content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
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

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        /* Stats Grid */
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

        /* Charts */
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

        /* Recent Tables */
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

        .card-header a {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #0f4c75;
          text-decoration: none;
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

        /* Data Table */
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

        .pack-name,
        .hotel-name,
        .user-name,
        .client-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
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

        /* Status Badges */
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

        /* Star Rating */
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

        /* Role Badge */
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background: #0f4c7520;
          color: #0f4c75;
        }

        .role-badge.client {
          background: #6c757d20;
          color: #6c757d;
        }

        /* Settings */
        .settings-container {
          background: white;
          border-radius: 16px;
          padding: 30px;
        }

        .settings-section {
          margin-bottom: 30px;
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          color: #1e272e;
        }

        .settings-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #666;
        }

        .settings-input,
        .settings-select {
          padding: 10px;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .settings-input:focus,
        .settings-select:focus {
          outline: none;
          border-color: #0f4c75;
        }

        .settings-toggle {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .toggle-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .save-settings-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 30px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .save-settings-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid,
          .recent-tables {
            grid-template-columns: 1fr;
          }

          .settings-form {
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

          .content-header {
            flex-direction: column;
            gap: 15px;
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