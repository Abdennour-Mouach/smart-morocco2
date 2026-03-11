import React, { useState } from "react";
import { MapPin, Calendar, Users, Star, Clock, Heart, Share2, ChevronRight } from "lucide-react";

const PackCard = ({ pack }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Données par défaut pour l'exemple
  const defaultPack = {
    id: 1,
    title: "Circuit Impérial",
    subtitle: "Marrakech - Fès - Meknès - Rabat",
    description: "Découvrez les 4 villes impériales du Maroc dans un circuit de luxe de 7 jours",
    price: 890,
    originalPrice: 1200,
    currency: "€",
    duration: "7 jours",
    nights: "6 nuits",
    people: "2-8 personnes",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Populaire",
    includes: ["Hôtels 5*", "Petit-déjeuner", "Guide francophone", "Transport VIP"],
    highlights: [
      "Nuit dans le désert d'Agafay",
      "Couscous traditionnel",
      "Hammam & Spa inclus"
    ],
    location: "Maroc",
    availableDates: ["Avr 2024", "Mai 2024", "Juin 2024"],
    discount: 25
  };

  const data = pack || defaultPack;

  return (
    <div 
      className="pack-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
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

      {/* Image Section */}
      <div className="card-image">
        <img src={data.image} alt={data.title} />
        <div className="image-overlay"></div>
        
        {/* Action Buttons */}
        <div className="image-actions">
          <button 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Ajouter aux favoris"
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="action-btn" aria-label="Partager">
            <Share2 size={18} />
          </button>
        </div>

        {/* Quick Info Overlay */}
        <div className={`quick-info ${isHovered ? 'visible' : ''}`}>
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

      {/* Content Section */}
      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <div>
            <h3 className="card-title">{data.title}</h3>
            <p className="card-subtitle">
              <MapPin size={14} />
              {data.subtitle}
            </p>
          </div>
          <div className="card-rating">
            <span className="rating-score">{data.rating}</span>
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

        {/* Description */}
        <p className="card-description">{data.description}</p>

        {/* Highlights */}
        <div className="card-highlights">
          {data.highlights.map((highlight, index) => (
            <span key={index} className="highlight-tag">
              ✦ {highlight}
            </span>
          ))}
        </div>

        {/* Includes */}
        <div className="card-includes">
          {data.includes.map((item, index) => (
            <div key={index} className="include-item">
              <div className="include-dot"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="card-dates">
          <Calendar size={16} />
          <div className="dates-list">
            {data.availableDates.map((date, index) => (
              <span key={index} className="date-chip">{date}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
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
            Réserver
            <ChevronRight size={18} className="btn-icon" />
          </button>
        </div>
      </div>

      <style jsx>{`
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

        /* Badges */
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

        /* Image Section */
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
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4));
        }

        /* Action Buttons */
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

        /* Quick Info */
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

        /* Content Section */
        .card-content {
          padding: 20px;
        }

        /* Header */
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

        /* Description */
        .card-description {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
          margin: 0 0 16px 0;
        }

        /* Highlights */
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

        /* Includes */
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

        /* Dates */
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

        /* Footer */
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

        /* Animation d'entrée */
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

        /* Responsive */
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