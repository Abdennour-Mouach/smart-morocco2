import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { 
  ChevronRight, 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Calendar,
  Heart,
  Compass,
  Award,
  TrendingUp
} from "lucide-react";
import PackCard from "../components/PackCard";
import api from "../services/api";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [featuredPacks, setFeaturedPacks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [hebergements, setHebergements] = useState([]);
  const videoRef = useRef(null);

  // Témoignages
  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      country: "France",
      comment: "Un voyage inoubliable ! L'organisation était parfaite et les guides passionnés. Le coucher de soleil dans le Sahara restera gravé dans ma mémoire.",
      rating: 5,
      destination: "Circuit Impérial"
    },
    {
      id: 2,
      name: "Thomas Anderson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      country: "États-Unis",
      comment: "Morocco is magical! Smart Morocco a rendu notre voyage tellement facile. Les riads sélectionnés étaient magnifiques.",
      rating: 5,
      destination: "Marrakech & Sahara"
    },
    {
      id: 3,
      name: "Fatima Zahra",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      country: "Maroc",
      comment: "Fière de faire découvrir mon pays à travers cette plateforme. Une expérience authentique et des souvenirs précieux.",
      rating: 5,
      destination: "Nord du Maroc"
    }
  ];

  // Statistiques
  const stats = [
    { icon: <Users size={32} />, value: "50K+", label: "Voyageurs" },
    { icon: <MapPin size={32} />, value: "200+", label: "Destinations" },
    { icon: <Star size={32} />, value: "4.9", label: "Note moyenne" },
    { icon: <Award size={32} />, value: "15+", label: "Prix d'excellence" }
  ];

  // Avantages
  const benefits = [
    {
      icon: <Compass size={32} />,
      title: "Guides Locaux Experts",
      description: "Des guides passionnés qui connaissent les moindres recoins du Maroc"
    },
    {
      icon: <Heart size={32} />,
      title: "Expériences Authentiques",
      description: "Vivez le Maroc comme un local, pas comme un touriste"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Meilleur Prix Garanti",
      description: "Des tarifs compétitifs sans compromis sur la qualité"
    }
  ];

  // Effet pour la vidéo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Lecture automatique impossible:", error);
      });
    }
  }, []);

  useEffect(() => {
    const fetchFeaturedPacks = async () => {
      try {
        const res = await api.get("/api/packs");
        setFeaturedPacks(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        console.error("Erreur lors du chargement des packs:", err);
        setFeaturedPacks([]);
      }
    };

    fetchFeaturedPacks();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/api/activites");
        setActivities(Array.isArray(res.data) ? res.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Erreur lors du chargement des activites:", err);
        setActivities([]);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchHebergements = async () => {
      try {
        const res = await api.get("/api/hebergements");
        setHebergements(Array.isArray(res.data) ? res.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Erreur lors du chargement des hebergements:", err);
        setHebergements([]);
      }
    };

    fetchHebergements();
  }, []);

  const toImageUrl = (url) => {
    if (!url) return "/images/AitHaddou.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads/")) return `http://localhost:5006${url}`;
    return url;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);

  const renderStars = (etoiles) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Number(etoiles || 0) ? "currentColor" : "none"}
      />
    ));

  return (
    <div className="home">
      

      {/* Hero Section avec Vidéo */}
      <section className="hero">
        <div className="video-background">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`hero-video ${isVideoLoaded ? 'loaded' : ''}`}
          >
            <source src="/videos/Morocco.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="hero-content">
          <span className="hero-badge">✨ Bienvenue au Maroc</span>
          <h1 className="hero-title">
            Découvrez la Magie
            <span className="title-highlight"> du Royaume</span>
          </h1>
          <p className="hero-subtitle">
            Des médinas ancestrales aux dunes dorées du Sahara, 
            laissez-vous envoûter par la richesse culturelle du Maroc
          </p>

          {/* Barre de recherche */}
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Où voulez-vous aller ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              className="destination-select"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              <option value="marrakech">Marrakech-Safi</option>
              <option value="fes">Fès-Meknès</option>
              <option value="rabat">Rabat-Salé</option>
              <option value="tanger">Tanger-Tétouan</option>
              <option value="sahara">Sahara</option>
            </select>
            <button className="search-btn">
              <Search size={20} />
              <span>Rechercher</span>
            </button>
          </div>

          {/* Tags populaires */}
          <div className="popular-tags">
            <span className="tags-label">Populaires :</span>
            <button className="tag-btn">Marrakech</button>
            <button className="tag-btn">Sahara</button>
            <button className="tag-btn">Fès</button>
            <button className="tag-btn">Chefchaouen</button>
            <button className="tag-btn">Essaouira</button>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Découvrir</span>
          <div className="scroll-icon"></div>
        </div>
      </section>

      {/* Reste du contenu identique */}
      {/* Statistiques */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Hebergements Populaires */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Sejournez</span>
              <h2 className="section-title">Hebergements <span className="title-accent"></span></h2>
            </div>
            <Link to="/packs" className="view-all-link">
              Voir tout
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="destinations-grid">
            {hebergements.length > 0 ? hebergements.map((hebergement) => (
              <div key={hebergement.id} className="destination-card">
                <div className="destination-image">
                  <img src={toImageUrl(hebergement.imageUrl)} alt={hebergement.nomHibergement || "Hebergement"} />
                  <span className="destination-badge">{hebergement.type || "Hebergement"}</span>
                  <button className="favorite-btn">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{hebergement.nomHibergement || "Hebergement"}</h3>
                  <p className="destination-region">
                    <MapPin size={14} />
                    {hebergement.adresse || "Adresse non specifiee"}
                  </p>
                  <div className="destination-rating">
                    {renderStars(hebergement.etoiles)}
                    <span className="rating-score">{Number(hebergement.etoiles || 0)}</span>
                    <span className="rating-count">etoiles</span>
                  </div>
                  <div className="destination-footer">
                    <div className="destination-price">
                      <span className="price-from">A partir de</span>
                      <span className="price-value">{formatPrice(hebergement.prixParNuit)}</span>
                    </div>
                    <Link to="/packs" className="destination-link">
                      Decouvrir
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <p className="muted">Aucun hebergement disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Expériences Uniques */}
      <section className="experiences-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Vivez</span>
              <h2 className="section-title">Expériences <span className="title-accent">Authentiques</span></h2>
            </div>
          </div>

          <div className="experiences-grid">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="experience-card">
                <div className="experience-image">
                  <img src={toImageUrl(activity.imageUrl)} alt={activity.nomActivity || "Activite"} />
                </div>
                <div className="experience-content">
                  <h3 className="experience-title">{activity.nomActivity || "Activite"}</h3>
                  <p className="experience-location">
                    <MapPin size={14} />
                    {activity.lieu || "Lieu a definir"}
                  </p>
                  <div className="experience-footer">
                    <div className="experience-duration">
                      <Calendar size={14} />
                      {activity.duree || "Duree a definir"}
                    </div>
                    <div className="experience-price">
                      <span className="price-value">{formatPrice(activity.prix)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="muted">Aucune activite disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs Vedettes */}
      <section className="featured-packs">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Nos coups de cœur</span>
              <h2 className="section-title">Packs <span className="title-accent">Vedettes</span></h2>
            </div>
          </div>

          <div className="packs-grid">
            {featuredPacks.length > 0 ? (
              featuredPacks.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))
            ) : (
              <p className="muted">Aucun pack disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Avis <span className="title-accent">Voyageurs</span></h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-country">{testimonial.country}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <p className="testimonial-destination">— {testimonial.destination}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt pour l'aventure marocaine ?</h2>
            <p className="cta-text">
              Rejoignez des milliers de voyageurs qui ont déjà découvert 
              la magie du Maroc avec Smart Morocco
            </p>
            <div className="cta-buttons">
              <Link to="/packs" className="cta-btn primary">
                Explorer nos packs
                <ChevronRight size={20} />
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <style jsx>{`
        .home {
          overflow-x: hidden;
          background: #faf7f2;
        }/* Hero Section (inchangé) */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          color: white;
          overflow: hidden;
          margin-top: 70px;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.5s ease;
        }

        .hero-video.loaded {
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
            rgba(15, 76, 117, 0.7) 0%,
            rgba(191, 87, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
          animation: fadeInUp 1s ease;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .title-highlight {
          display: block;
          color: #ffb84d;
          position: relative;
        }

        .title-highlight::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 4px;
          background: linear-gradient(90deg, #0f4c75, #bf5700);
          border-radius: 2px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
          opacity: 0.9;
        }

        /* Search Bar */
        .search-bar {
          display: flex;
          gap: 10px;
          background: white;
          padding: 8px;
          border-radius: 60px;
          max-width: 700px;
          margin: 0 auto 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 15px;
          background: #f5f5f5;
          border-radius: 50px;
        }

        .search-icon {
          color: #0f4c75;
          margin-right: 10px;
        }

        .search-input {
          flex: 1;
          padding: 12px 0;
          border: none;
          background: transparent;
          font-size: 1rem;
          outline: none;
        }

        .destination-select {
          padding: 12px 20px;
          border: none;
          background: #f5f5f5;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
          cursor: pointer;
          color: #1e272e;
        }

        .search-btn {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(191, 87, 0, 0.4);
        }

        /* Popular Tags */
        .popular-tags {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .tags-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .tag-btn {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tag-btn:hover {
          background: #bf5700;
          border-color: #bf5700;
          transform: scale(1.05);
        }

        /* Scroll Indicator */
        .hero-scroll {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Stats Section */
        .stats-section {
          padding: 60px 0;
          background: white;
          position: relative;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          text-align: center;
        }

        .stat-item {
          padding: 20px;
        }

        .stat-icon {
          color: #bf5700;
          margin-bottom: 15px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f4c75;
          line-height: 1;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #666;
          font-size: 1rem;
        }

        /* Section Headers */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .section-header.centered {
          text-align: center;
          justify-content: center;
        }

        .section-subtitle {
          display: block;
          color: #bf5700;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0;
        }

        .title-accent {
          color: #0f4c75;
          position: relative;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #0f4c75;
          text-decoration: none;
          font-weight: 600;
          transition: gap 0.3s ease;
        }

        .view-all-link:hover {
          gap: 10px;
        }

        /* Destinations Grid */
        .destinations-section {
          padding: 80px 0;
          background: #faf7f2;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .destination-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .destination-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(15, 76, 117, 0.2);
        }

        .destination-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .destination-card:hover .destination-image img {
          transform: scale(1.1);
        }

        .destination-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #0f4c75;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .favorite-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ff6b6b;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: #ff6b6b;
          color: white;
        }

        .destination-content {
          padding: 20px;
        }

        .destination-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 5px 0;
        }

        .destination-region {
          font-size: 0.9rem;
          color: #666;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 10px;
        }

        .destination-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
          color: #ffb800;
        }

        .rating-score {
          font-weight: 700;
          color: #1e272e;
        }

        .rating-count {
          color: #999;
          font-size: 0.8rem;
        }

        .destination-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .destination-price {
          display: flex;
          flex-direction: column;
        }

        .price-from {
          font-size: 0.8rem;
          color: #999;
        }

        .price-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f4c75;
        }

        .destination-link {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .destination-link:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
        }

        /* Experiences Section */
        .experiences-section {
          padding: 80px 0;
          background: white;
        }

        .experiences-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .muted {
          grid-column: 1 / -1;
          text-align: center;
          color: #666;
          font-size: 1rem;
          padding: 24px 0;
        }

        .experience-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .experience-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(15, 76, 117, 0.15);
        }

        .experience-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .experience-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .experience-card:hover .experience-image img {
          transform: scale(1.1);
        }

        .experience-icon {
          position: absolute;
          bottom: -20px;
          right: 15px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 5px 15px rgba(191, 87, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .experience-card:hover .experience-icon {
          transform: rotate(360deg);
        }

        .experience-content {
          padding: 20px;
        }

        .experience-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 5px 0;
        }

        .experience-location {
          font-size: 0.9rem;
          color: #666;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 10px;
        }

        .experience-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .experience-duration {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #666;
        }

        .experience-price {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }

        .experience-price .price-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #bf5700;
        }

        .experience-price .price-unit {
          font-size: 0.7rem;
          color: #999;
        }

        /* Benefits Section */
        .benefits-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #0f4c75 0%, #bf5700 100%);
          color: white;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .benefit-card {
          text-align: center;
          padding: 30px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-10px);
        }

        .benefit-icon {
          color: #ffb84d;
          margin-bottom: 20px;
        }

        .benefit-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .benefit-description {
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Featured Packs */
        .featured-packs {
          padding: 80px 0;
          background: #faf7f2;
        }

        .packs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 80px 0;
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
        }

        .testimonial-card {
          background: #faf7f2;
          padding: 30px;
          border-radius: 20px;
          position: relative;
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
        }

        .testimonial-card::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 30px;
          font-size: 80px;
          color: #bf5700;
          opacity: 0.2;
          font-family: serif;
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .testimonial-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #bf5700;
        }

        .testimonial-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 5px 0;
        }

        .testimonial-info p {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .testimonial-rating {
          margin-left: auto;
          color: #ffb800;
          display: flex;
          gap: 2px;
        }

        .testimonial-comment {
          font-style: italic;
          line-height: 1.6;
          color: #444;
          margin-bottom: 15px;
        }

        .testimonial-destination {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f4c75;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 0;
          background: linear-gradient(135deg, rgba(15, 76, 117, 0.9), rgba(191, 87, 0, 0.9)),
                      url('https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          text-align: center;
        }

        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .cta-text {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .cta-btn {
          padding: 15px 35px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .cta-btn.primary {
          background: #ffb84d;
          color: #1e272e;
        }

        .cta-btn.primary:hover {
          background: white;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .cta-btn.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-btn.secondary:hover {
          background: white;
          color: #0f4c75;
          transform: translateY(-3px);
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

        /* Responsive Design */
        @media (max-width: 1024px) {.destinations-grid,
          .experiences-grid,
          .packs-grid,
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {.hero-title {
            font-size: 2.5rem;
          }

          .search-bar {
            flex-direction: column;
            border-radius: 20px;
          }

          .destinations-grid,
          .experiences-grid,
          .packs-grid,
          .testimonials-grid,
          .stats-grid,
          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-title {
            font-size: 2rem;
          }

          .profile-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;






