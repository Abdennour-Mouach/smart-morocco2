import React, { useEffect, useMemo, useState } from "react";
import Footer from "./Footer";

import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Calendar,
  Users,
  Wallet,
  ArrowUpDown,
  Grid3x3,
  LayoutList,
  Compass,
  MessageCircle,
  Quote,
  Send,
  Heart,
  Trash2
} from "lucide-react";
import api from "../services/api";
import PackCard from "../components/PackCard";
import {
  readFavoritePacks,
  removeFavoritePack,
  toggleFavoritePack
} from "../utils/favorites";

const LOCAL_PACK_REVIEWS_KEY = "smartMoroccoPackReviews";

const featuredPackReviews = [
  {
    id: "featured-1",
    author: "Sara El Amrani",
    packName: "Circuit Marrakech & Atlas",
    destination: "Marrakech",
    rating: 5,
    comment: "Un voyage tres bien organise, avec un guide attentif et des etapes parfaitement rythmees.",
    date: "2026-04-18"
  },
  {
    id: "featured-2",
    author: "Youssef Benali",
    packName: "Escapade Essaouira",
    destination: "Essaouira",
    rating: 4,
    comment: "Belle selection d'activites et hebergement confortable. Le coucher de soleil etait superbe.",
    date: "2026-03-26"
  },
  {
    id: "featured-3",
    author: "Mina Rodriguez",
    packName: "Imperial Fes",
    destination: "Fes",
    rating: 5,
    comment: "Experience authentique, equipe reactive et tres bons conseils pour profiter de la medina.",
    date: "2026-02-11"
  }
];

const Packs = () => {
  const [packs, setPacks] = useState([]);
  const [filteredPacks, setFilteredPacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("popularite");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [favoritePacks, setFavoritePacks] = useState([]);
  const [localPackReviews, setLocalPackReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewForm, setReviewForm] = useState({
    author: "",
    packId: "general",
    rating: 5,
    comment: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    minPrice: 0,
    maxPrice: 0,
    avgRating: 0
  });

  // Images de fond pour le hero
  const backgroundImages = [
    { src: "/images/ESSAOUIRA.jpg", location: "Essaouira" },
    { src: "/images/Dar3ia.jpg", location: "Dariia" },
    { src: "/images/Fas.jpg",  location: "Fès" },
    { src: "/images/Hassan2.jpg", alt: "Mosquée Hassan 2", location: "Casablanca" }
  ];

  // Changement automatique des images de fond toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  useEffect(() => {
    try {
      const savedReviews = JSON.parse(localStorage.getItem(LOCAL_PACK_REVIEWS_KEY) || "[]");
      setLocalPackReviews(Array.isArray(savedReviews) ? savedReviews : []);
    } catch {
      setLocalPackReviews([]);
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
      setFavoritePacks(readFavoritePacks(storedUser));
    } catch {
      setUser(null);
      setFavoritePacks(readFavoritePacks(null));
    }
  }, []);

  useEffect(() => {
    fetchPacks();
  }, []);

  const packReviews = useMemo(
    () => [...localPackReviews, ...featuredPackReviews],
    [localPackReviews]
  );

  const reviewStats = useMemo(() => {
    const total = packReviews.length;
    const sum = packReviews.reduce((acc, review) => acc + (Number(review.rating) || 0), 0);

    return {
      total,
      average: total > 0 ? sum / total : 0,
      satisfied: total > 0
        ? Math.round((packReviews.filter((review) => Number(review.rating) >= 4).length / total) * 100)
        : 0
    };
  }, [packReviews]);

  const reviewsByPack = useMemo(() => {
    const groupedReviews = new Map();

    packReviews.forEach((review) => {
      if (!review.packId || review.packId === "general") {
        return;
      }

      const key = String(review.packId);
      const current = groupedReviews.get(key) || { count: 0, totalRating: 0 };
      groupedReviews.set(key, {
        count: current.count + 1,
        totalRating: current.totalRating + (Number(review.rating) || 0)
      });
    });

    return groupedReviews;
  }, [packReviews]);

  const favoritePackIds = useMemo(
    () => new Set(favoritePacks.map((favorite) => String(favorite.id))),
    [favoritePacks]
  );

  const favoriteList = useMemo(
    () =>
      favoritePacks.map((favorite) => {
        const latestPack = packs.find((pack) => String(pack.id) === String(favorite.id));
        return latestPack ? { ...favorite, ...latestPack } : favorite;
      }),
    [favoritePacks, packs]
  );

  const fetchPacks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/packs");
      setPacks(res.data);
      setFilteredPacks(res.data);
      
      // Extraire les destinations uniques
      const uniqueDestinations = [...new Set(res.data.map(pack => pack.destination).filter(Boolean))];
      setDestinations(uniqueDestinations);
      
      // Calculer les statistiques
      const prices = res.data.map(pack => pack.prixTotal || 0);
      const ratings = res.data.map(pack => pack.noteMoyenne || 0);
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;
      
      setStats({
        total: res.data.length,
        minPrice,
        maxPrice,
        avgRating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0
      });
      
      setPriceRange([minPrice, maxPrice]);
    } catch (err) {
      console.error("Erreur lors du chargement des packs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer et trier les packs
  useEffect(() => {
    let result = [...packs];

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(pack => 
        pack.nomPack?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.destination?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par destinations
    if (selectedDestinations.length > 0) {
      result = result.filter(pack => 
        selectedDestinations.includes(pack.destination)
      );
    }

    // Filtre par prix
    result = result.filter(pack => 
      (pack.prixTotal || 0) >= priceRange[0] && (pack.prixTotal || 0) <= priceRange[1]
    );

    // Filtre par durée
    if (selectedDuration) {
      result = result.filter(pack => {
        const jours = pack.duree || 0;
        if (selectedDuration === "3-5 jours") return jours >= 3 && jours <= 5;
        if (selectedDuration === "6-8 jours") return jours >= 6 && jours <= 8;
        if (selectedDuration === "9-12 jours") return jours >= 9 && jours <= 12;
        if (selectedDuration === "13+ jours") return jours >= 13;
        return true;
      });
    }

    // Tri
    switch (sortBy) {
      case "prix-asc":
        result.sort((a, b) => (a.prixTotal || 0) - (b.prixTotal || 0));
        break;
      case "prix-desc":
        result.sort((a, b) => (b.prixTotal || 0) - (a.prixTotal || 0));
        break;
      case "note":
        result.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
        break;
      case "duree":
        result.sort((a, b) => (a.duree || 0) - (b.duree || 0));
        break;
      default:
        result.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
    }

    setFilteredPacks(result);
  }, [packs, searchTerm, selectedDestinations, priceRange, selectedDuration, sortBy]);

  const toggleDestination = (destination) => {
    setSelectedDestinations(prev =>
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDestinations([]);
    setPriceRange([stats.minPrice, stats.maxPrice]);
    setSelectedDuration("");
    setSortBy("popularite");
  };

  const handleToggleFavorite = (pack) => {
    setFavoritePacks((currentFavorites) => toggleFavoritePack(user, currentFavorites, pack));
  };

  const handleRemoveFavorite = (event, packId) => {
    event.stopPropagation();
    setFavoritePacks((currentFavorites) => removeFavoritePack(user, currentFavorites, packId));
  };

  const getPackReviewSummary = (pack) => {
    const summary = reviewsByPack.get(String(pack.id));

    if (!summary) {
      return null;
    }

    return {
      noteMoyenne: Number((summary.totalRating / summary.count).toFixed(1)),
      nombreAvis: summary.count
    };
  };

  const getSelectedPack = () =>
    packs.find((pack) => String(pack.id) === String(reviewForm.packId));

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
      setReviewMessage("Ajoutez votre nom et un commentaire pour publier votre avis.");
      return;
    }

    const selectedPack = getSelectedPack();
    const newReview = {
      id: `local-${Date.now()}`,
      author: reviewForm.author.trim(),
      packId: reviewForm.packId,
      packName: selectedPack?.nomPack || "Experience generale",
      destination: selectedPack?.destination || "Maroc",
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: new Date().toISOString()
    };

    setLocalPackReviews((currentReviews) => {
      const nextReviews = [newReview, ...currentReviews];
      try {
        localStorage.setItem(LOCAL_PACK_REVIEWS_KEY, JSON.stringify(nextReviews));
      } catch {
        // Keep the review visible in the current session even if storage is blocked.
      }
      return nextReviews;
    });

    setReviewForm({
      author: "",
      packId: "general",
      rating: 5,
      comment: ""
    });
    setReviewMessage("Merci, votre avis a ete ajoute a la section.");
  };

  const renderStars = (rating, size = 16) => (
    <span className="review-stars" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? "currentColor" : "none"}
          className={star <= rating ? "star-filled" : "star-empty"}
        />
      ))}
    </span>
  );

  const formatReviewDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des packs touristiques...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
        <style>{`
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
          .loading-progress {
            width: 200px;
            height: 4px;
            background: #eaeaea;
            border-radius: 2px;
            margin-top: 20px;
            overflow: hidden;
          }
          .progress-bar {
            width: 60%;
            height: 100%;
            background: linear-gradient(90deg, #0f4c75, #bf5700);
            animation: progress 2s ease infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="packs-page">
      {/* Hero Section avec fond d'images changeantes */}
      <section className="packs-hero">
        {/* Images de fond en carrousel */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image.src})` }}
          />
        ))}
        
        <div className="hero-overlay"></div>
        
        {/* Indicateurs */}
        <div className="hero-indicators">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Localisation actuelle */}
        <div className="hero-location">
          <MapPin size={16} />
          <span>{backgroundImages[currentImageIndex].location}</span>
        </div>

        {/* Contenu principal */}
        <div className="hero-content">
          <div className="hero-badge">
            <Compass size={20} />
            <span>Explorez nos {stats.total} packs touristiques</span>
          </div>
          
          <h1 className="hero-title">
            Découvrez le Maroc
            <span className="title-highlight"> Autrement</span>
          </h1>
          
          <p className="hero-subtitle">
            Des circuits authentiques, des expériences uniques et des souvenirs inoubliables
          </p>
          
          {/* Barre de recherche */}
          <div className="hero-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un pack, une destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      <div className="container">
        {/* Statistiques rapides */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Wallet size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Prix moyen</span>
              <span className="stat-value">
                {Math.round((stats.minPrice + stats.maxPrice) / 2)}€
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Star size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Note moyenne</span>
              <span className="stat-value">{stats.avgRating}/5</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <MapPin size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Destinations</span>
              <span className="stat-value">{destinations.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Voyageurs</span>
              <span className="stat-value">10K+</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Mes favoris</span>
              <span className="stat-value">{favoritePacks.length}</span>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="tools-bar">
          <div className="results-count">
            <span className="count-number">{filteredPacks.length}</span>
            <span className="count-text">packs trouvés</span>
          </div>

          <div className="tools-actions">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filtres</span>
              {selectedDestinations.length > 0 && (
                <span className="filter-badge">{selectedDestinations.length}</span>
              )}
            </button>

            <div className="sort-selector">
              <ArrowUpDown size={18} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popularite">Popularité</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="note">Note</option>
                <option value="duree">Durée</option>
              </select>
            </div>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>

        <section className="favorites-section" aria-labelledby="favorites-title">
          <div className="favorites-header">
            <div>
              <span className="section-kicker compact">
                <Heart size={18} />
                Liste personnelle
              </span>
              <h2 id="favorites-title">Mes packs favoris</h2>
            </div>
            <span className="favorites-count">{favoritePacks.length} favori{favoritePacks.length > 1 ? "s" : ""}</span>
          </div>

          {favoriteList.length > 0 ? (
            <div className="favorites-list">
              {favoriteList.map((pack) => (
                <article
                  key={pack.id}
                  className="favorite-item"
                  onClick={() => (window.location.href = `/packs/${pack.id}`)}
                >
                  <img src={pack.imageUrl || "/images/ESSAOUIRA.jpg"} alt={pack.nomPack || "Pack favori"} />
                  <div className="favorite-info">
                    <h3>{pack.nomPack || "Pack voyage"}</h3>
                    <span>
                      <MapPin size={14} />
                      {pack.destination || "Maroc"}
                    </span>
                  </div>
                  <div className="favorite-meta">
                    <strong>{pack.prixTotal || 0} MAD</strong>
                    <span>{pack.duree || "-"} jours</span>
                  </div>
                  <button
                    type="button"
                    className="remove-favorite-btn"
                    onClick={(event) => handleRemoveFavorite(event, pack.id)}
                    aria-label={`Retirer ${pack.nomPack || "ce pack"} des favoris`}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="favorites-empty">
              <Heart size={22} />
              <span>Cliquez sur le coeur d'un pack pour l'ajouter ici.</span>
            </div>
          )}
        </section>

        <div className="content-wrapper">
          {/* Panneau de filtres */}
          <aside className={`filters-panel ${showFilters ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>
                <SlidersHorizontal size={18} />
                Filtres
              </h3>
              <button onClick={clearFilters} className="clear-filters">
                <X size={16} />
                Effacer
              </button>
            </div>

            {/* Filtre par destination */}
            <div className="filter-section">
              <h4 className="filter-title">
                <MapPin size={16} />
                Destinations
              </h4>
              <div className="filter-options">
                {destinations.map(dest => (
                  <label key={dest} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDestinations.includes(dest)}
                      onChange={() => toggleDestination(dest)}
                    />
                    <span className="checkbox-label">{dest}</span>
                    <span className="checkbox-count">
                      {packs.filter(p => p.destination === dest).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtre par prix */}
            <div className="filter-section">
              <h4 className="filter-title">
                <Wallet size={16} />
                Budget
              </h4>
              <div className="price-range">
                <div className="price-inputs">
                  <div className="price-input">
                    <span>Min</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      min={stats.minPrice}
                      max={stats.maxPrice}
                    />
                  </div>
                  <span className="price-separator">-</span>
                  <div className="price-input">
                    <span>Max</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      min={stats.minPrice}
                      max={stats.maxPrice}
                    />
                  </div>
                </div>
                <div className="price-range-slider">
                  <input
                    type="range"
                    min={stats.minPrice}
                    max={stats.maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                  <input
                    type="range"
                    min={stats.minPrice}
                    max={stats.maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
              </div>
            </div>

            {/* Filtre par durée */}
            <div className="filter-section">
              <h4 className="filter-title">
                <Calendar size={16} />
                Durée
              </h4>
              <div className="duration-options">
                {["3-5 jours", "6-8 jours", "9-12 jours", "13+ jours"].map(duree => (
                  <button
                    key={duree}
                    className={`duration-btn ${selectedDuration === duree ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(selectedDuration === duree ? '' : duree)}
                  >
                    {duree}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grille des packs */}
          <main className={`packs-grid-container ${viewMode}`}>
            {filteredPacks.length > 0 ? (
              <div className={`packs-grid ${viewMode}`}>
                {filteredPacks.map(pack => (
                  <PackCard
                    key={pack.id}
                    isFavorite={favoritePackIds.has(String(pack.id))}
                    onToggleFavorite={handleToggleFavorite}
                    pack={{
                      ...pack,
                      ...(getPackReviewSummary(pack) || {})
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <Compass size={48} />
                </div>
                <h3>Aucun pack trouvé</h3>
                <p>Essayez d'ajuster vos filtres ou d'élargir votre recherche</p>
                <button onClick={clearFilters} className="reset-filters-btn">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>

        <section className="pack-reviews-section" aria-labelledby="pack-reviews-title">
          <div className="reviews-heading">
            <div>
              <span className="section-kicker">
                <MessageCircle size={18} />
                Avis voyageurs
              </span>
              <h2 id="pack-reviews-title">Ils ont teste nos packs touristiques</h2>
              <p>
                Consultez les retours des voyageurs et partagez votre experience apres votre sejour.
              </p>
            </div>
            <div className="reviews-score-card">
              <span className="score-value">{reviewStats.average.toFixed(1)}</span>
              {renderStars(Math.round(reviewStats.average), 18)}
              <span className="score-label">{reviewStats.total} avis publies</span>
            </div>
          </div>

          <div className="reviews-insights">
            <div className="insight-item">
              <span className="insight-value">{reviewStats.satisfied}%</span>
              <span className="insight-label">voyageurs satisfaits</span>
            </div>
            <div className="insight-item">
              <span className="insight-value">{reviewStats.total}</span>
              <span className="insight-label">experiences partagees</span>
            </div>
            <div className="insight-item">
              <span className="insight-value">24h</span>
              <span className="insight-label">temps moyen de reponse</span>
            </div>
          </div>

          <div className="reviews-content">
            <div className="reviews-list" aria-label="Derniers avis voyageurs">
              {packReviews.slice(0, 4).map((review) => (
                <article key={review.id} className="review-card">
                  <Quote size={28} className="quote-icon" />
                  <div className="review-card-header">
                    <div>
                      <h3>{review.author}</h3>
                      <span>{review.packName}</span>
                    </div>
                    {renderStars(Number(review.rating) || 0)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-footer">
                    <span>{review.destination}</span>
                    <span>{formatReviewDate(review.date)}</span>
                  </div>
                </article>
              ))}
            </div>

            <form className="review-form-card" onSubmit={handleReviewSubmit}>
              <div className="form-header">
                <h3>Ajouter un avis</h3>
                <p>Votre retour aide les prochains voyageurs a choisir le bon pack.</p>
              </div>

              <label>
                Nom
                <input
                  type="text"
                  value={reviewForm.author}
                  onChange={(event) => setReviewForm({ ...reviewForm, author: event.target.value })}
                  placeholder="Votre nom"
                />
              </label>

              <label>
                Pack
                <select
                  value={reviewForm.packId}
                  onChange={(event) => setReviewForm({ ...reviewForm, packId: event.target.value })}
                >
                  <option value="general">Experience generale</option>
                  {packs.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.nomPack || pack.destination || `Pack #${pack.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Note
                <div className="rating-picker">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={Number(reviewForm.rating) >= rating ? "active" : ""}
                      onClick={() => setReviewForm({ ...reviewForm, rating })}
                      aria-label={`${rating} etoile${rating > 1 ? "s" : ""}`}
                    >
                      <Star size={20} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Avis
                <textarea
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                  placeholder="Partagez ce qui vous a marque..."
                  rows="4"
                />
              </label>

              {reviewMessage && <p className="review-message">{reviewMessage}</p>}

              <button type="submit" className="submit-review-btn">
                <Send size={18} />
                Publier l'avis
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
      <style>{`
        .packs-page {
          background: #faf7f2;
          min-height: 100vh;
        }

        /* Hero Section avec fond d'images changeantes */
        .packs-hero {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
        }

        .hero-background.active {
          opacity: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(15, 76, 117, 0.7) 0%,
            rgba(191, 87, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 1;
        }

        /* Indicateurs */
        .hero-indicators {
          position: absolute;
          bottom: 30px;
          right: 30px;
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
          background: #ffb84d;
          width: 60px;
        }

        .indicator:hover {
          background: white;
        }

        /* Localisation */
        .hero-location {
          position: absolute;
          top: 30px;
          left: 30px;
          z-index: 3;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          color: white;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeIn 1s ease;
        }

        /* Contenu */
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 20px;
          animation: fadeInUp 1s ease;
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
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .title-highlight {
          color: #ffb84d;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .hero-search {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 5px 5px 5px 20px;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-icon {
          color: #999;
        }

        .search-input {
          flex: 1;
          padding: 15px;
          border: none;
          outline: none;
          font-size: 1rem;
          background: transparent;
        }

        /* Container */
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
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

        .favorites-section {
          background: white;
          border: 1px solid rgba(15, 76, 117, 0.08);
          border-radius: 18px;
          padding: 22px;
          margin-bottom: 30px;
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.05);
        }

        .favorites-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
        }

        .favorites-header h2 {
          margin: 6px 0 0;
          color: #1e272e;
          font-size: 1.35rem;
        }

        .section-kicker.compact {
          margin-bottom: 0;
          font-size: 0.9rem;
        }

        .favorites-count {
          color: #0f4c75;
          font-weight: 700;
          white-space: nowrap;
        }

        .favorites-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .favorite-item {
          min-height: 92px;
          display: grid;
          grid-template-columns: 76px minmax(0, 1fr) auto 38px;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border: 1px solid #eef1f3;
          border-radius: 14px;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .favorite-item:hover {
          border-color: rgba(15, 76, 117, 0.35);
          transform: translateY(-2px);
        }

        .favorite-item img {
          width: 76px;
          height: 72px;
          object-fit: cover;
          border-radius: 10px;
        }

        .favorite-info {
          min-width: 0;
        }

        .favorite-info h3 {
          margin: 0 0 8px;
          color: #1e272e;
          font-size: 0.98rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .favorite-info span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 0.86rem;
        }

        .favorite-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          color: #666;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .favorite-meta strong {
          color: #bf5700;
          font-size: 0.95rem;
        }

        .remove-favorite-btn {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          background: #fff3f3;
          color: #dc3545;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .remove-favorite-btn:hover {
          background: #ffe1e1;
          transform: translateY(-1px);
        }

        .favorites-empty {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px dashed rgba(15, 76, 117, 0.25);
          border-radius: 14px;
          color: #66717a;
          background: #f8fafb;
        }

        .results-count {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .count-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f4c75;
        }

        .count-text {
          color: #666;
        }

        .tools-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          background: white;
          color: #1e272e;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .filter-toggle.active {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        .filter-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #bf5700;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .sort-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          background: white;
        }

        .sort-select {
          border: none;
          outline: none;
          background: transparent;
          color: #1e272e;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
        }

        .view-btn {
          padding: 8px;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          background: white;
          color: #999;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        /* Content Wrapper */
        .content-wrapper {
          display: flex;
          gap: 30px;
        }

        /* Filters Panel */
        .filters-panel {
          width: 280px;
          background: white;
          border-radius: 20px;
          padding: 20px;
          height: fit-content;
          transition: all 0.3s ease;
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eaeaea;
        }

        .filters-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          color: #1e272e;
          margin: 0;
        }

        .clear-filters {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: none;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters:hover {
          background: #eaeaea;
          color: #bf5700;
        }

        .filter-section {
          margin-bottom: 25px;
        }

        .filter-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          color: #1e272e;
          margin-bottom: 15px;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #666;
        }

        .filter-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #0f4c75;
        }

        .checkbox-label {
          flex: 1;
        }

        .checkbox-count {
          font-size: 0.8rem;
          color: #999;
        }

        /* Price Range */
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .price-input {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px;
          border: 1px solid #eaeaea;
          border-radius: 8px;
        }

        .price-input span {
          font-size: 0.8rem;
          color: #999;
        }

        .price-input input {
          width: 60px;
          border: none;
          outline: none;
          color: #1e272e;
        }

        .price-separator {
          color: #999;
        }

        .price-range-slider {
          position: relative;
          height: 30px;
        }

        .price-range-slider input[type="range"] {
          position: absolute;
          width: 100%;
          height: 2px;
          background: none;
          pointer-events: none;
          -webkit-appearance: none;
        }

        .price-range-slider input[type="range"]::-webkit-slider-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0f4c75;
          cursor: pointer;
          -webkit-appearance: none;
        }

        /* Duration Options */
        .duration-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .duration-btn {
          padding: 10px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .duration-btn.active {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        /* Packs Grid */
        .packs-grid-container {
          flex: 1;
        }

        .packs-grid {
          display: grid;
          gap: 30px;
        }

        .packs-grid.grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .packs-grid.list {
          grid-template-columns: 1fr;
        }

        /* No Results */
        .no-results {
          background: white;
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
        }

        .no-results-icon {
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

        .no-results h3 {
          font-size: 1.5rem;
          color: #1e272e;
          margin-bottom: 10px;
        }

        .no-results p {
          color: #666;
          margin-bottom: 20px;
        }

        .reset-filters-btn {
          padding: 12px 30px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .reset-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(191, 87, 0, 0.3);
        }

        /* Reviews Section */
        .pack-reviews-section {
          margin-top: 56px;
          padding-top: 42px;
          border-top: 1px solid rgba(15, 76, 117, 0.12);
        }

        .reviews-heading {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          align-items: flex-end;
          margin-bottom: 22px;
        }

        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0f4c75;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .reviews-heading h2 {
          margin: 0 0 10px;
          color: #1e272e;
          font-size: 2rem;
        }

        .reviews-heading p {
          max-width: 640px;
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .reviews-score-card {
          min-width: 180px;
          padding: 18px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 28px rgba(15, 76, 117, 0.1);
          text-align: center;
        }

        .score-value {
          display: block;
          color: #1e272e;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }

        .score-label {
          display: block;
          margin-top: 8px;
          color: #666;
          font-size: 0.88rem;
        }

        .review-stars {
          display: inline-flex;
          gap: 3px;
          color: #ffb84d;
          vertical-align: middle;
        }

        .review-stars .star-empty {
          color: #d4d8dc;
        }

        .reviews-insights {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .insight-item {
          background: white;
          border: 1px solid rgba(15, 76, 117, 0.08);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .insight-value {
          color: #bf5700;
          font-size: 1.45rem;
          font-weight: 800;
        }

        .insight-label {
          color: #666;
          font-size: 0.92rem;
        }

        .reviews-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 24px;
          align-items: start;
        }

        .reviews-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .review-card,
        .review-form-card {
          background: white;
          border: 1px solid rgba(15, 76, 117, 0.08);
          border-radius: 16px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
        }

        .review-card {
          position: relative;
          padding: 20px;
          overflow: hidden;
        }

        .quote-icon {
          position: absolute;
          right: 18px;
          top: 18px;
          color: rgba(15, 76, 117, 0.12);
        }

        .review-card-header {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
          padding-right: 34px;
        }

        .review-card h3 {
          margin: 0 0 5px;
          color: #1e272e;
          font-size: 1rem;
        }

        .review-card-header span {
          color: #777;
          font-size: 0.85rem;
        }

        .review-comment {
          margin: 0;
          color: #3c4650;
          line-height: 1.65;
        }

        .review-footer {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #eef1f3;
          color: #777;
          font-size: 0.85rem;
        }

        .review-form-card {
          padding: 22px;
        }

        .form-header h3 {
          margin: 0 0 6px;
          color: #1e272e;
        }

        .form-header p {
          margin: 0 0 18px;
          color: #666;
          line-height: 1.5;
          font-size: 0.92rem;
        }

        .review-form-card label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
          color: #1e272e;
          font-weight: 700;
        }

        .review-form-card input,
        .review-form-card select,
        .review-form-card textarea {
          width: 100%;
          border: 1px solid #dce3e8;
          border-radius: 10px;
          padding: 11px 12px;
          color: #1e272e;
          font: inherit;
          outline: none;
          background: white;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .review-form-card input:focus,
        .review-form-card select:focus,
        .review-form-card textarea:focus {
          border-color: #0f4c75;
          box-shadow: 0 0 0 3px rgba(15, 76, 117, 0.12);
        }

        .review-form-card textarea {
          resize: vertical;
          min-height: 110px;
        }

        .rating-picker {
          display: flex;
          gap: 6px;
        }

        .rating-picker button {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce3e8;
          border-radius: 10px;
          background: white;
          color: #d4d8dc;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rating-picker button.active,
        .rating-picker button:hover {
          color: #ffb84d;
          border-color: rgba(255, 184, 77, 0.7);
          background: rgba(255, 184, 77, 0.12);
        }

        .review-message {
          margin: 0 0 14px;
          color: #0f4c75;
          font-size: 0.9rem;
        }

        .submit-review-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .submit-review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 76, 117, 0.18);
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .packs-grid.grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .reviews-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
          }

          .filters-panel {
            width: 100%;
            display: none;
          }

          .filters-panel.open {
            display: block;
          }

          .packs-grid.grid {
            grid-template-columns: 1fr;
          }

          .tools-bar {
            flex-direction: column;
            gap: 15px;
          }

          .tools-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .favorites-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .favorite-item {
            grid-template-columns: 64px minmax(0, 1fr) 38px;
          }

          .favorite-item img {
            width: 64px;
            height: 64px;
          }

          .favorite-meta {
            grid-column: 2 / 3;
            align-items: flex-start;
          }

          .hero-title {
            font-size: 2rem;
          }

          .reviews-heading {
            flex-direction: column;
            align-items: stretch;
          }

          .reviews-score-card {
            min-width: 0;
          }

          .reviews-insights,
          .reviews-list {
            grid-template-columns: 1fr;
          }

          .review-card-header,
          .review-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Packs;
