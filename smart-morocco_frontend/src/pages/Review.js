import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Star,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  Award,
  Camera,
  Share2,
  PlusCircle
} from "lucide-react";
import api from "../services/api";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [utilisateurId, setUtilisateurId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Nouvel avis
  const [newReview, setNewReview] = useState({
    pack_id: "",
    note: 5,
    commentaire: "",
    titre: "",
    photos: []
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
      fetchReviews();
    }
  }, [utilisateurId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/reviews/utilisateur/${utilisateurId}`);
      setReviews(res.data);
      setFilteredReviews(res.data);
      
      // Calculer les statistiques
      const total = res.data.length;
      const sum = res.data.reduce((acc, r) => acc + (r.note || 0), 0);
      const avg = total > 0 ? (sum / total).toFixed(1) : 0;
      
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      res.data.forEach(r => {
        if (r.note >= 1 && r.note <= 5) {
          distribution[r.note]++;
        }
      });

      setStats({
        total,
        averageRating: avg,
        distribution
      });
    } catch (err) {
      console.error("Erreur lors du chargement des avis:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer et trier les avis
  useEffect(() => {
    let result = [...reviews];

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(r => 
        r.commentaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pack_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par note
    if (ratingFilter !== "all") {
      result = result.filter(r => r.note === parseInt(ratingFilter));
    }

    // Tri
    switch (sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date_review) - new Date(b.date_review));
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date_review) - new Date(a.date_review));
        break;
      case "rating-asc":
        result.sort((a, b) => (a.note || 0) - (b.note || 0));
        break;
      case "rating-desc":
        result.sort((a, b) => (b.note || 0) - (a.note || 0));
        break;
      default:
        break;
    }

    setFilteredReviews(result);
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        ...newReview,
        utilisateur_id: utilisateurId,
        date_review: new Date().toISOString()
      };
      await api.post("/reviews", reviewData);
      setShowAddReview(false);
      setNewReview({
        pack_id: "",
        note: 5,
        commentaire: "",
        titre: "",
        photos: []
      });
      fetchReviews();
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'avis:", err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await api.delete(`/reviews/${id}`);
        fetchReviews();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };
  const handleEditReview = async (e) => {
  e.preventDefault();

  try {
    const updatedReview = {
      ...editingReview,
      utilisateur_id: utilisateurId
    };

    await api.put(`/reviews/${editingReview.id_review}`, updatedReview);

    setEditingReview(null);
    fetchReviews();
  } catch (err) {
    console.error("Erreur lors de la modification de l'avis:", err);
  }
};
const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files);

  const photoUrls = files.map(file => URL.createObjectURL(file));

  if (editingReview) {
    setEditingReview({
      ...editingReview,
      photos: [...(editingReview.photos || []), ...photoUrls]
    });
  } else {
    setNewReview({
      ...newReview,
      photos: [...newReview.photos, ...photoUrls]
    });
  }
};

  const getRatingStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`star ${star <= rating ? 'filled' : ''}`}
            fill={star <= rating ? '#ffb84d' : 'none'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return formatDate(dateString);
  };

  if (!utilisateurId) {
    return (
      <div className="login-prompt">
        <div className="prompt-card">
          <MessageCircle size={48} className="prompt-icon" />
          <h2>Connectez-vous pour voir vos avis</h2>
          <p>Partagez votre expérience et aidez d'autres voyageurs</p>
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
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={20} />
            <span>Vos avis</span>
          </div>
          <h1 className="hero-title">
            Partagez votre <span className="title-highlight">Expérience</span>
          </h1>
          <p className="hero-subtitle">
            Vos retours aident d'autres voyageurs à choisir leurs aventures
          </p>
        </div>
      </section>

      <div className="container">
        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <MessageCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total avis</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          
          <div className="stat-card rating">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Note moyenne</span>
              <span className="stat-value">{stats.averageRating}/5</span>
            </div>
          </div>

          <div className="stat-card distribution">
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="distribution-row">
                  <span className="rating-number">{rating}★</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="rating-count">{stats.distribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card action">
            <button 
              className="add-review-btn"
              onClick={() => setShowAddReview(true)}
            >
              <PlusCircle size={24} />
              <span>Nouvel avis</span>
            </button>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="tools-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher dans vos avis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Plus récents</option>
              <option value="date-asc">Plus anciens</option>
              <option value="rating-desc">Meilleure note</option>
              <option value="rating-asc">Moins bonne note</option>
            </select>
          </div>
        </div>

        {/* Liste des avis */}
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement de vos avis...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="reviews-grid">
            {filteredReviews.map((review) => (
              <div key={review.id_review} className="review-card">
                <div className="card-header">
                  <div className="pack-info">
                    <h3 className="pack-name">{review.pack_nom || "Pack voyage"}</h3>
                    <div className="review-meta">
                      <Calendar size={14} />
                      <span>{getTimeAgo(review.date_review)}</span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {getRatingStars(review.note)}
                  </div>
                </div>

                {review.titre && (
                  <h4 className="review-title">{review.titre}</h4>
                )}

                <p className="review-comment">"{review.commentaire}"</p>

                {review.photos && review.photos.length > 0 && (
                  <div className="review-photos">
                    {review.photos.map((photo, index) => (
                      <img 
                        key={index} 
                        src={photo} 
                        alt={`Review ${index + 1}`}
                        className="review-photo"
                      />
                    ))}
                  </div>
                )}

                <div className="review-stats">
                  <button className="stat-btn like">
                    <ThumbsUp size={16} />
                    <span>{review.likes || 0}</span>
                  </button>
                  <button className="stat-btn share">
                    <Share2 size={16} />
                  </button>
                </div>

                <div className="card-footer">
                  <button 
                    className="action-btn edit"
                    onClick={() => setEditingReview(review)}
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteReview(review.id_review)}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageCircle size={48} />
            </div>
            <h3>Aucun avis pour le moment</h3>
            <p>Partagez votre première expérience de voyage avec la communauté</p>
            <button 
              onClick={() => setShowAddReview(true)}
              className="add-first-review-btn"
            >
              <PlusCircle size={18} />
              Rédiger un avis
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification d'avis */}
      {(showAddReview || editingReview) && (
        <div className="modal-overlay" onClick={() => {
          setShowAddReview(false);
          setEditingReview(null);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => {
                setShowAddReview(false);
                setEditingReview(null);
              }}
            >
              ×
            </button>
            
            <div className="modal-header">
              <h2>{editingReview ? "Modifier l'avis" : "Nouvel avis"}</h2>
            </div>

            <form onSubmit={editingReview ? handleEditReview : handleAddReview}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Pack</label>
                  <select
                    value={editingReview ? editingReview.pack_id : newReview.pack_id}
                    onChange={(e) => editingReview 
                      ? setEditingReview({...editingReview, pack_id: e.target.value})
                      : setNewReview({...newReview, pack_id: e.target.value})
                    }
                    required
                    className="form-select"
                  >
                    <option value="">Sélectionnez un pack</option>
                    {/* Options des packs à charger depuis l'API */}
                  </select>
                </div>

                <div className="form-group">
                  <label>Note</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className={`star-input ${star <= (editingReview ? editingReview.note : newReview.note) ? 'selected' : ''}`}
                        onClick={() => {
                          if (editingReview) {
                            setEditingReview({...editingReview, note: star});
                          } else {
                            setNewReview({...newReview, note: star});
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Titre (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Résumez votre expérience"
                    value={editingReview ? editingReview.titre || '' : newReview.titre}
                    onChange={(e) => editingReview
                      ? setEditingReview({...editingReview, titre: e.target.value})
                      : setNewReview({...newReview, titre: e.target.value})
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Commentaire</label>
                  <textarea
                    placeholder="Partagez votre expérience en détail..."
                    value={editingReview ? editingReview.commentaire || '' : newReview.commentaire}
                    onChange={(e) => editingReview
                      ? setEditingReview({...editingReview, commentaire: e.target.value})
                      : setNewReview({...newReview, commentaire: e.target.value})
                    }
                    required
                    rows="5"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Photos</label>
                  <div className="photo-upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="file-input"
                    />
                    <Camera size={24} />
                    <span>Ajouter des photos</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="modal-btn cancel"
                  onClick={() => {
                    setShowAddReview(false);
                    setEditingReview(null);
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className="modal-btn submit">
                  {editingReview ? "Mettre à jour" : "Publier l'avis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .reviews-page {
          background: #faf7f2;
          min-height: 100vh;
        }

        /* Hero Section */
        .reviews-hero {
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
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card.total,
        .stat-card.rating,
        .stat-card.distribution,
        .stat-card.action {
          display: flex;
          align-items: center;
          gap: 15px;
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

        .stat-card.rating .stat-icon {
          background: #ffb84d;
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

        /* Distribution Bars */
        .distribution-bars {
          width: 100%;
        }

        .distribution-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .rating-number {
          font-size: 0.9rem;
          color: #666;
          min-width: 30px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #eaeaea;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0f4c75, #bf5700);
          transition: width 0.3s ease;
        }

        .rating-count {
          font-size: 0.9rem;
          color: #666;
          min-width: 30px;
        }

        /* Add Review Button */
        .add-review-btn {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border: none;
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .add-review-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(191, 87, 0, 0.3);
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

        /* Reviews Grid */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .review-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 20px;
        }

        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(15, 76, 117, 0.1);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .pack-info h3 {
          font-size: 1.1rem;
          color: #0f4c75;
          margin: 0 0 5px 0;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #999;
          font-size: 0.9rem;
        }

        .review-rating {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #ddd;
        }

        .star.filled {
          color: #ffb84d;
        }

        .review-title {
          font-size: 1.2rem;
          color: #1e272e;
          margin: 0 0 10px 0;
        }

        .review-comment {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .review-photos {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .review-photo {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
        }

        .review-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eaeaea;
        }

        .stat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border: none;
          background: none;
          color: #666;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .stat-btn.like:hover {
          color: #0f4c75;
        }

        .stat-btn.share:hover {
          color: #bf5700;
        }

        .card-footer {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.edit {
          background: #0f4c75;
          color: white;
        }

        .action-btn.delete {
          background: #dc3545;
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

        .add-first-review-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 30px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .add-first-review-btn:hover {
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
        }

        .modal-header h2 {
          margin: 0;
          color: #1e272e;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e272e;
          margin-bottom: 8px;
        }

        .form-select,
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-select:focus,
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0f4c75;
          background: white;
        }

        .rating-input {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .star-input {
          color: #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .star-input.selected {
          color: #ffb84d;
          transform: scale(1.1);
        }

        .photo-upload {
          border: 2px dashed #eaeaea;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .photo-upload:hover {
          border-color: #0f4c75;
          background: #f8f9fa;
        }

        .file-input {
          display: none;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eaeaea;
          display: flex;
          gap: 10px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-btn.cancel {
          background: #6c757d;
          color: white;
        }

        .modal-btn.submit {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
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

          .reviews-grid {
            grid-template-columns: 1fr;
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

          .hero-title {
            font-size: 2rem;
          }

          .stat-card.distribution {
            grid-column: span 2;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Review;