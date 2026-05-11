import React, { useMemo, useState } from "react";
import { MapPin, Calendar, Users, Star, Clock, Heart, Share2, ChevronRight } from "lucide-react";

const defaultPack = {
  id: 1,
  title: "Circuit Imperial",
  subtitle: "Marrakech - Fes - Meknes - Rabat",
  description: "Decouvrez les 4 villes imperiales du Maroc dans un circuit de luxe de 7 jours",
  price: 890,
  originalPrice: 1200,
  currency: "EUR",
  duration: "7 jours",
  nights: "6 nuits",
  people: "2-8 personnes",
  rating: 4.8,
  reviews: 124,
  image: "https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  badge: "Populaire",
  includes: ["Hotels 5*", "Petit-dejeuner", "Guide francophone"],
  highlights: [
    "Nuit dans le desert d'Agafay",
    "Couscous traditionnel",
    "Hammam & Spa inclus"
  ],
  location: "Maroc",
  availableDates: ["Avr 2026", "Mai 2026", "Juin 2026"],
  discount: 25
};

const toNumber = (value, fallback) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const PackCard = ({ pack, isFavorite = false, onToggleFavorite }) => {
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = onToggleFavorite ? isFavorite : localIsLiked;

  const data = useMemo(() => {
    if (!pack) {
      return defaultPack;
    }

    const includes = [];
    if (pack.id_hebergement) includes.push("Hebergement");
    if (pack.id_restaurant) includes.push("Restaurant");
    if (pack.id_activite) includes.push("Activite");

    const rating = toNumber(pack.noteMoyenne ?? pack.rating, 4.7);
    const reviews = toNumber(pack.nombreAvis ?? pack.reviews, 0);

    return {
      id: pack.id,
      title: pack.nomPack,
      subtitle: pack.destination || "Maroc",
      description: pack.description,
      price: pack.prixTotal,
      originalPrice: null,
      currency: "MAD",
      duration: pack.duree ? `${pack.duree} jours` : "Duree a definir",
      nights: pack.duree ? `${Math.max(pack.duree - 1, 0)} nuits` : "",
      people: "2-8 personnes",
      rating,
      reviews,
      image: pack.imageUrl || "/images/ESSAOUIRA.jpg",
      badge: "Populaire",
      includes: includes.length > 0 ? includes : ["Hebergement", "Restaurant", "Guide"],
      highlights: ["Experiences locales", "Cuisine marocaine", "Visites guidees"],
      location: pack.destination || "Maroc",
      availableDates: ["Avr 2026", "Mai 2026", "Juin 2026"],
      discount: null,
    };
  }, [pack]);

  if (!data) {
    return null;
  }

  const handleFavoriteClick = (event) => {
    event.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(pack);
      return;
    }

    setLocalIsLiked((current) => !current);
  };

  const handleShareClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="pack-card"
      onClick={() => (window.location.href = `/packs/${data.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-badges">
        {data.badge && (
          <span className="badge popular">
            <Star size={12} fill="currentColor" />
            {data.badge}
          </span>
        )}
        {data.discount && (
          <span className="badge discount">
            -{data.discount}%
          </span>
        )}
      </div>

      <div className="card-image">
        <img src={data.image} alt={data.title} />
        <div className="image-overlay"></div>

        <div className="image-actions">
          <button
            className={`action-btn ${isLiked ? "liked" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={isLiked}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="action-btn" aria-label="Partager" onClick={handleShareClick}>
            <Share2 size={18} />
          </button>
        </div>

        <div className={`quick-info ${isHovered ? "visible" : ""}`}>
          <div className="quick-info-item">
            <Clock size={16} />
            <span>{data.duration}</span>
          </div>
          <div className="quick-info-item">
            <Users size={16} />
            <span>{data.people}</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <div>
            <h3 className="card-title">{data.title}</h3>
            <p className="card-subtitle">
              <MapPin size={14} />
              {data.subtitle}
            </p>
          </div>
          <div className="card-rating">
            <span className="rating-score">{data.rating.toFixed(1)}</span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(data.rating) ? "currentColor" : "none"}
                  className={i < Math.floor(data.rating) ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
            <span className="rating-count">({data.reviews} avis)</span>
          </div>
        </div>

        <p className="card-description">{data.description}</p>

        <div className="card-highlights">
          {data.highlights.map((highlight, index) => (
            <span key={index} className="highlight-tag">
              * {highlight}
            </span>
          ))}
        </div>

        <div className="card-includes">
          {data.includes.map((item, index) => (
            <div key={index} className="include-item">
              <div className="include-dot"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="card-dates">
          <Calendar size={16} />
          <div className="dates-list">
            {data.availableDates.map((date, index) => (
              <span key={index} className="date-chip">{date}</span>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <div className="price-section">
            <div className="price-container">
              {data.originalPrice && (
                <span className="original-price">
                  {data.currency}{data.originalPrice}
                </span>
              )}
              <span className="current-price">
                {data.currency}{data.price}
                <span className="price-unit">/pers</span>
              </span>
            </div>
            <span className="nights-info">{data.nights}</span>
          </div>

          <button className="book-btn">
            Reserver
            <ChevronRight size={18} className="btn-icon" />
          </button>
        </div>
      </div>

      <style>{`
        .pack-card {
          position: relative;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          max-width: 400px;
          width: 100%;
        }

        .pack-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(15, 76, 117, 0.2);
        }

        .card-badges {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          display: flex;
          gap: 8px;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(4px);
        }

        .badge.popular {
          background: linear-gradient(135deg, #0f4c75, #00b8b0);
          color: white;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .badge.discount {
          background: rgba(255, 107, 107, 0.95);
          color: white;
        }

        .card-image {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        .pack-card:hover .card-image img {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4));
        }

        .image-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1e272e;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .action-btn:hover {
          transform: scale(1.1);
          background: #0f4c75;
          color: white;
        }

        .action-btn.liked {
          color: #ff6b6b;
        }

        .quick-info {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          gap: 12px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 5;
        }

        .quick-info.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .quick-info-item {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          padding: 6px 12px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #0f4c75;
        }

        .card-content {
          padding: 20px;
        }

        .card-header {
          margin-bottom: 12px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 4px 0;
        }

        .card-subtitle {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .rating-score {
          font-weight: 700;
          color: #0f4c75;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
          color: #ffb800;
        }

        .star-filled {
          color: #ffb800;
        }

        .star-empty {
          color: #ddd;
        }

        .rating-count {
          font-size: 12px;
          color: #999;
        }

        .card-description {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
          margin: 0 0 16px 0;
        }

        .card-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .highlight-tag {
          background: linear-gradient(135deg, rgba(15, 76, 117, 0.1), rgba(0, 184, 176, 0.1));
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 12px;
          color: #0f4c75;
          font-weight: 500;
        }

        .card-includes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 16px;
        }

        .include-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #444;
        }

        .include-dot {
          width: 4px;
          height: 4px;
          background: #0f4c75;
          border-radius: 50%;
        }

        .card-dates {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding: 12px;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          border-radius: 16px;
          color: #0f4c75;
        }

        .dates-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .date-chip {
          background: white;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          color: #0f4c75;
          border: 1px solid rgba(15, 76, 117, 0.2);
          transition: all 0.3s ease;
        }

        .date-chip:hover {
          background: #0f4c75;
          color: white;
          border-color: #0f4c75;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .price-container {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .current-price {
          font-size: 24px;
          font-weight: 700;
          color: #0f4c75;
        }

        .price-unit {
          font-size: 12px;
          font-weight: 400;
          color: #999;
          margin-left: 2px;
        }

        .nights-info {
          font-size: 12px;
          color: #666;
        }

        .book-btn {
          background: linear-gradient(135deg, #0f4c75, #00b8b0);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(15, 76, 117, 0.3);
        }

        .book-btn:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 20px rgba(15, 76, 117, 0.4);
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .book-btn:hover .btn-icon {
          transform: translateX(3px);
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pack-card {
          animation: cardAppear 0.6s ease forwards;
        }

        @media (max-width: 480px) {
          .card-content {
            padding: 16px;
          }

          .card-title {
            font-size: 18px;
          }

          .current-price {
            font-size: 20px;
          }

          .book-btn {
            padding: 10px 18px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default PackCard;
