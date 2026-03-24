import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Compass
} from "lucide-react";
import api from "../services/api";
import PackCard from "../components/PackCard";

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
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/packs");
      setPacks(res.data);
      setFilteredPacks(res.data);
      
      // Extraire les destinations uniques
      const uniqueDestinations = [...new Set(res.data.map(pack => pack.destination))];
      setDestinations(uniqueDestinations);
      
      // Calculer les statistiques
      const prices = res.data.map(pack => pack.prix);
      const ratings = res.data.map(pack => pack.note_moyenne || 0);
      
      setStats({
        total: res.data.length,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        avgRating: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      });
      
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
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
        pack.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      pack.prix >= priceRange[0] && pack.prix <= priceRange[1]
    );

    // Filtre par durée
    if (selectedDuration) {
      result = result.filter(pack => pack.duree === selectedDuration);
    }

    // Tri
    switch (sortBy) {
      case "prix-asc":
        result.sort((a, b) => a.prix - b.prix);
        break;
      case "prix-desc":
        result.sort((a, b) => b.prix - a.prix);
        break;
      case "note":
        result.sort((a, b) => (b.note_moyenne || 0) - (a.note_moyenne || 0));
        break;
      case "duree":
        result.sort((a, b) => (a.duree_nombre || 0) - (b.duree_nombre || 0));
        break;
      default:
        result.sort((a, b) => (b.popularite || 0) - (a.popularite || 0));
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des packs touristiques...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
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
                  <PackCard key={pack.id_pack} pack={pack} />
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
      </div>

      <style jsx>{`
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
          grid-template-columns: repeat(4, 1fr);
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

          .hero-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Packs;