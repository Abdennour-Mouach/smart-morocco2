import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar,
  MapPin,
  User,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ChevronRight,
  Download,
  Eye,
  Printer,
  Compass
} from "lucide-react";
import api from "../services/api";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [utilisateurId, setUtilisateurId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalSpent: 0
  });

  // Récupérer l'utilisateur connecté depuis le localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id_utilisateur) {
      setUtilisateurId(user.id_utilisateur);
    }
  }, []);

  useEffect(() => {
    if (utilisateurId) {
      fetchReservations();
    }
  }, [utilisateurId]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/reservations/utilisateur/${utilisateurId}`);
      setReservations(res.data);
      setFilteredReservations(res.data);
      
      // Calculer les statistiques
      const confirmed = res.data.filter(r => r.statut?.toLowerCase() === "confirmé").length;
      const pending = res.data.filter(r => r.statut?.toLowerCase() === "en attente").length;
      const cancelled = res.data.filter(r => r.statut?.toLowerCase() === "annulé").length;
      const totalSpent = res.data
        .filter(r => r.statut?.toLowerCase() === "confirmé")
        .reduce((sum, r) => sum + (r.montant_total || 0), 0);
      
      setStats({
        total: res.data.length,
        confirmed,
        pending,
        cancelled,
        totalSpent
      });
    } catch (err) {
      console.error("Erreur lors du chargement des réservations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer et trier les réservations
  useEffect(() => {
    let result = [...reservations];

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(r => 
        r.id_reservation?.toString().includes(searchTerm) ||
        r.pack_titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destination?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      result = result.filter(r => r.statut?.toLowerCase() === statusFilter);
    }

    // Tri
    switch (sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date_reservation) - new Date(b.date_reservation));
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date_reservation) - new Date(a.date_reservation));
        break;
      case "prix-asc":
        result.sort((a, b) => (a.montant_total || 0) - (b.montant_total || 0));
        break;
      case "prix-desc":
        result.sort((a, b) => (b.montant_total || 0) - (a.montant_total || 0));
        break;
      default:
        break;
    }

    setFilteredReservations(result);
  }, [reservations, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmé":
        return <CheckCircle size={16} className="status-icon confirmed" />;
      case "en attente":
        return <Clock size={16} className="status-icon pending" />;
      case "annulé":
        return <XCircle size={16} className="status-icon cancelled" />;
      default:
        return <AlertCircle size={16} className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmé":
        return "status-badge confirmed";
      case "en attente":
        return "status-badge pending";
      case "annulé":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  if (!utilisateurId) {
    return (
      <div className="login-prompt">
        <div className="prompt-card">
          <User size={48} className="prompt-icon" />
          <h2>Connectez-vous pour voir vos réservations</h2>
          <p>Veuillez vous connecter pour accéder à l'historique de vos réservations</p>
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
    <div className="reservations-page">
      {/* Hero Section */}
      <section className="reservations-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Compass size={20} />
            <span>Vos réservations</span>
          </div>
          <h1 className="hero-title">
            Mes <span className="title-highlight">Voyages</span>
          </h1>
          <p className="hero-subtitle">
            Gérez vos réservations et suivez vos aventures marocaines
          </p>
        </div>
      </section>

      <div className="container">
        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total réservations</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          <div className="stat-card confirmed">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Confirmées</span>
              <span className="stat-value">{stats.confirmed}</span>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">En attente</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
          <div className="stat-card spent">
            <div className="stat-icon">
              <CreditCard size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total dépensé</span>
              <span className="stat-value">{formatPrice(stats.totalSpent)}</span>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="tools-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmé">Confirmé</option>
              <option value="en attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Date (récent)</option>
              <option value="date-asc">Date (ancien)</option>
              <option value="prix-desc">Prix (élevé)</option>
              <option value="prix-asc">Prix (faible)</option>
            </select>
          </div>
        </div>

        {/* Liste des réservations */}
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement de vos réservations...</p>
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="reservations-list">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id_reservation} className="reservation-card">
                <div className="card-header">
                  <div className="header-left">
                    <div className="reservation-id">
                      <Package size={16} />
                      <span>Réservation #{reservation.id_reservation}</span>
                    </div>
                    <div className="reservation-date">
                      <Calendar size={14} />
                      <span>{formatDate(reservation.date_reservation)}</span>
                    </div>
                  </div>
                  <div className={getStatusClass(reservation.statut)}>
                    {getStatusIcon(reservation.statut)}
                    <span>{reservation.statut || "En attente"}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="pack-info">
                    <h3 className="pack-title">{reservation.pack_titre || "Pack voyage"}</h3>
                    <div className="pack-destination">
                      <MapPin size={14} />
                      <span>{reservation.destination || "Maroc"}</span>
                    </div>
                  </div>

                  <div className="reservation-details">
                    <div className="detail-item">
                      <User size={14} />
                      <span>{reservation.nb_personnes || 1} personne(s)</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>Du {new Date(reservation.date_debut).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>Au {new Date(reservation.date_fin).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="price-tag">
                    <span className="price-label">Total</span>
                    <span className="price-value">{formatPrice(reservation.montant_total)}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewDetails(reservation)}
                  >
                    <Eye size={16} />
                    Détails
                  </button>
                  <button className="action-btn print">
                    <Printer size={16} />
                    Imprimer
                  </button>
                  <button className="action-btn download">
                    <Download size={16} />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Compass size={48} />
            </div>
            <h3>Aucune réservation trouvée</h3>
            <p>Vous n'avez pas encore de réservations. Commencez par explorer nos packs !</p>
            <Link to="/packs" className="explore-btn">
              Explorer les packs
              <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Modal des détails */}
      {showDetails && selectedReservation && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
            
            <div className="modal-header">
              <h2>Détails de la réservation</h2>
              <div className={getStatusClass(selectedReservation.statut)}>
                {getStatusIcon(selectedReservation.statut)}
                <span>{selectedReservation.statut || "En attente"}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Informations générales</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">N° réservation:</span>
                    <span className="detail-value">#{selectedReservation.id_reservation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date de réservation:</span>
                    <span className="detail-value">{formatDate(selectedReservation.date_reservation)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pack:</span>
                    <span className="detail-value">{selectedReservation.pack_titre || "Non spécifié"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Destination:</span>
                    <span className="detail-value">{selectedReservation.destination || "Maroc"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Détails du voyage</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Nombre de personnes:</span>
                    <span className="detail-value">{selectedReservation.nb_personnes || 1}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date de début:</span>
                    <span className="detail-value">{new Date(selectedReservation.date_debut).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date de fin:</span>
                    <span className="detail-value">{new Date(selectedReservation.date_fin).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Durée:</span>
                    <span className="detail-value">
                      {Math.ceil((new Date(selectedReservation.date_fin) - new Date(selectedReservation.date_debut)) / (1000 * 60 * 60 * 24))} jours
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Paiement</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Montant total:</span>
                    <span className="detail-value price-highlight">{formatPrice(selectedReservation.montant_total)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mode de paiement:</span>
                    <span className="detail-value">{selectedReservation.mode_paiement || "Non spécifié"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Statut du paiement:</span>
                    <span className="detail-value">{selectedReservation.statut_paiement || "En attente"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn print">
                <Printer size={16} />
                Imprimer
              </button>
              <button className="modal-btn download">
                <Download size={16} />
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reservations-page {
          background: #faf7f2;
          min-height: 100vh;
        }

        /* Hero Section */
        .reservations-hero {
          position: relative;
          height: 250px;
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
          max-width: 800px;
          padding: 0 20px;
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
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .title-highlight {
          color: #ffb84d;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
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
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-card.total .stat-icon {
          background: #0f4c75;
        }

        .stat-card.confirmed .stat-icon {
          background: #28a745;
        }

        .stat-card.pending .stat-icon {
          background: #ffc107;
        }

        .stat-card.spent .stat-icon {
          background: #bf5700;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e272e;
        }

        /* Tools Bar */
        .tools-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          background: white;
          padding: 15px 20px;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          color: #999;
        }

        .search-input {
          flex: 1;
          padding: 8px 0;
          border: none;
          outline: none;
          font-size: 1rem;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .filter-select {
          padding: 8px 15px;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          background: white;
          color: #1e272e;
          cursor: pointer;
          outline: none;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #eaeaea;
          border-top-color: #0f4c75;
          border-right-color: #bf5700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Reservations List */
        .reservations-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reservation-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .reservation-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(15, 76, 117, 0.1);
        }

        .card-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          border-bottom: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .reservation-id {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #0f4c75;
        }

        .reservation-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 0.9rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-badge.confirmed {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .status-badge.pending {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .status-badge.cancelled {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .status-icon {
          margin-right: 4px;
        }

        .card-body {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pack-info h3 {
          font-size: 1.2rem;
          color: #1e272e;
          margin: 0 0 5px 0;
        }

        .pack-destination {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          font-size: 0.9rem;
        }

        .reservation-details {
          display: flex;
          gap: 20px;
          color: #666;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
        }

        .price-tag {
          text-align: right;
        }

        .price-label {
          display: block;
          font-size: 0.8rem;
          color: #999;
        }

        .price-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #bf5700;
        }

        .card-footer {
          padding: 15px 20px;
          background: #f8f9fa;
          border-top: 1px solid #eaeaea;
          display: flex;
          gap: 10px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 50px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.view {
          background: #0f4c75;
          color: white;
        }

        .action-btn.print {
          background: #6c757d;
          color: white;
        }

        .action-btn.download {
          background: #28a745;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1e272e;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 20px;
        }

        .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 30px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .explore-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(191, 87, 0, 0.3);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          transition: color 0.3s ease;
        }

        .modal-close:hover {
          color: #bf5700;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h2 {
          margin: 0;
          color: #1e272e;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-section {
          margin-bottom: 25px;
        }

        .detail-section h3 {
          font-size: 1rem;
          color: #999;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-grid {
          display: grid;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-label {
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          color: #1e272e;
          font-weight: 600;
        }

        .price-highlight {
          color: #bf5700;
          font-size: 1.2rem;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eaeaea;
          display: flex;
          gap: 10px;
        }

        .modal-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-btn.print {
          background: #6c757d;
          color: white;
        }

        .modal-btn.download {
          background: #28a745;
          color: white;
        }

        .modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tools-bar {
            flex-direction: column;
            gap: 15px;
          }

          .search-box {
            max-width: 100%;
          }

          .filters {
            width: 100%;
          }

          .filter-select {
            flex: 1;
          }

          .card-body {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .reservation-details {
            flex-wrap: wrap;
          }

          .card-footer {
            flex-wrap: wrap;
          }

          .action-btn {
            flex: 1;
          }

          .hero-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .modal-content {
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Reservation;