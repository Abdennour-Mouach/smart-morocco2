import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  CheckCircle,
  Coffee,
  Camera,
  Wifi,
  Car,
  Shield,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Umbrella,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import api from "../services/api";

const PackDetails = () => {
  const { id } = useParams();
  const [pack, setPack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState(2);
  const [activeTab, setActiveTab] = useState("description");
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [similarPacks, setSimilarPacks] = useState([]);

  // Données mockées pour l'exemple
  const mockPack = {
    id_pack: 1,
    titre: "Circuit Impérial - Marrakech, Fès, Meknès, Rabat",
    description: "Plongez au cœur de l'histoire du Maroc en visitant ses quatre villes impériales. Ce circuit de 7 jours vous fera découvrir les trésors architecturaux, les médinas animées et la richesse culturelle du royaume.",
    long_description: `Découvrez l'âme du Maroc à travers ce circuit exceptionnel qui vous mènera à travers les quatre villes impériales. De Marrakech la rouge à Fès la spirituelle, en passant par Meknès l'impériale et Rabat la moderne, chaque étape vous révélera un visage unique du Maroc.

    **Jour 1 : Arrivée à Marrakech**
    Accueil à l'aéroport et transfert à votre riad. Installation et découverte de la place Jemaa el-Fna.

    **Jour 2 : Marrakech - Visite de la ville**
    Découverte des principaux monuments : Koutoubia, Palais de la Bahia, Tombeaux Saadiens. Après-midi libre pour explorer les souks.

    **Jour 3 : Marrakech - Fès**
    Route vers Fès via le Moyen Atlas. Arrêt à Ifrane, la "Suisse marocaine". Installation à Fès.

    **Jour 4 : Fès - Visite de la médina**
    Exploration de la plus ancienne médina du monde : université Al Quaraouiyine, tanneries Chouara, souks traditionnels.`,
    prix: 890,
    prix_promotion: 790,
    duree: "7 jours / 6 nuits",
    destination: "Maroc",
    villes: ["Marrakech", "Fès", "Meknès", "Rabat"],
    note_moyenne: 4.8,
    nb_avis: 124,
    images: [
      "https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1597218855407-debcc2f8e64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566368278-6a7db8bca6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546460573-f61e5e469f4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    includes: [
      "Hébergement en riads/hôtels 4*",
      "Petits déjeuners inclus",
      "Guide francophone privé",
      "Transport en véhicule climatisé",
      "Visites des monuments",
      "Assistance 24/7"
    ],
    excludes: [
      "Déjeuners et dîners",
      "Boissons",
      "Pourboires",
      "Assurance voyage"
    ],
    equipements: [
      { icon: <Wifi size={18} />, label: "WiFi gratuit" },
      { icon: <Coffee size={18} />, label: "Petit-déjeuner" },
      { icon: <Car size={18} />, label: "Transport inclus" },
      { icon: <Camera size={18} />, label: "Visites guidées" },
      { icon: <Shield size={18} />, label: "Assistance" },
      { icon: <Umbrella size={18} />, label: "Activités incluses" }
    ],
    itineraires: [
      { jour: 1, titre: "Arrivée à Marrakech", description: "Accueil et installation", image: "https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 2, titre: "Visite de Marrakech", description: "Découverte des monuments", image: "https://images.unsplash.com/photo-1597218855407-debcc2f8e64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 3, titre: "Route vers Fès", description: "Traversée du Moyen Atlas", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 4, titre: "Fès médiévale", description: "Exploration de la médina", image: "https://images.unsplash.com/photo-1566368278-6a7db8bca6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 5, titre: "Meknès et Volubilis", description: "Visite des ruines romaines", image: "https://images.unsplash.com/photo-1591123223454-7b7f6e952e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 6, titre: "Rabat la capitale", description: "Tour Hassan et Kasbah", image: "https://images.unsplash.com/photo-1580541832629-2d71f0d5428a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { jour: 7, titre: "Retour à Marrakech", description: "Dernières emplettes et transfert", image: "https://images.unsplash.com/photo-1539020144153-e5a23f8b9c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ],
    avis: [
      { id: 1, user: "Sophie M.", note: 5, commentaire: "Voyage exceptionnel ! Organisation parfaite et guide passionné.", date: "2024-02-15", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: 2, user: "Thomas L.", note: 5, commentaire: "Les riads sélectionnés étaient magnifiques. Je recommande !", date: "2024-02-10", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: 3, user: "Marie C.", note: 4, commentaire: "Très beau circuit, peut-être un peu chargé mais inoubliable.", date: "2024-02-05", avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
    ]
  };

  useEffect(() => {
    fetchPackDetails();
  }, [id]);

  const fetchPackDetails = async () => {
    setIsLoading(true);
    try {
      // Simulation d'appel API
      setTimeout(() => {
        setPack(mockPack);
        setReviews(mockPack.avis);
        setIsLoading(false);
      }, 1000);
      
      // Version réelle avec API :
      // const res = await api.get(`/packs/${id}`);
      // setPack(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement du pack:", err);
      setIsLoading(false);
    }
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % pack.images.length);
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev - 1 + pack.images.length) % pack.images.length);
  };

  const handleReservation = () => {
    // Logique de réservation
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    } else {
      // Rediriger vers la page de réservation
      window.location.href = `/reservation?pack=${id}&date=${selectedDate}&personnes=${nbPersonnes}`;
    }
  };

  const calculateTotal = () => {
    const prix = pack.prix_promotion || pack.prix;
    return prix * nbPersonnes;
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des détails du pack...</p>
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

  if (!pack) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h2>Pack non trouvé</h2>
        <p>Le pack que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/packs" className="back-btn">
          <ChevronLeft size={18} />
          Retour aux packs
        </Link>
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
          }
          .error-container h2 {
            font-size: 2rem;
            color: #1e272e;
            margin: 20px 0 10px;
          }
          .error-container p {
            color: #666;
            margin-bottom: 30px;
          }
          .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #0f4c75, #bf5700);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s ease;
          }
          .back-btn:hover {
            transform: translateY(-3px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pack-details-page">
      {/* Fil d'Ariane */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/packs" className="breadcrumb-link">Packs</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">{pack.titre}</span>
        </div>
      </div>

      <div className="container">
        {/* En-tête */}
        <div className="pack-header">
          <div className="header-left">
            <h1 className="pack-title">{pack.titre}</h1>
            <div className="pack-meta">
              <div className="pack-location">
                <MapPin size={18} />
                <span>{pack.destination}</span>
              </div>
              <div className="pack-duration">
                <Clock size={18} />
                <span>{pack.duree}</span>
              </div>
              <div className="pack-rating">
                {getRatingStars(pack.note_moyenne)}
                <span className="rating-score">{pack.note_moyenne}</span>
                <span className="rating-count">({pack.nb_avis} avis)</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className={`action-btn like ${isLiked ? 'liked' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="action-btn share">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="gallery-section">
          <div className="main-image">
            <img src={pack.images[activeImage]} alt={pack.titre} />
            <button className="gallery-nav prev" onClick={handlePrevImage}>
              <ChevronLeft size={24} />
            </button>
            <button className="gallery-nav next" onClick={handleNextImage}>
              <ChevronRight size={24} />
            </button>
            <div className="image-counter">
              {activeImage + 1} / {pack.images.length}
            </div>
          </div>
          <div className="thumbnail-grid">
            {pack.images.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`Vue ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="content-grid">
          {/* Colonne principale */}
          <div className="main-content">
            {/* Tabs de navigation */}
            <div className="tabs-nav">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'itineraire' ? 'active' : ''}`}
                onClick={() => setActiveTab('itineraire')}
              >
                Itinéraire
              </button>
              <button 
                className={`tab-btn ${activeTab === 'equipements' ? 'active' : ''}`}
                onClick={() => setActiveTab('equipements')}
              >
                Équipements
              </button>
              <button 
                className={`tab-btn ${activeTab === 'avis' ? 'active' : ''}`}
                onClick={() => setActiveTab('avis')}
              >
                Avis ({reviews.length})
              </button>
            </div>

            {/* Contenu des tabs */}
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <p className="description-text">{pack.long_description || pack.description}</p>
                  
                  <div className="highlights">
                    <h3>Points forts</h3>
                    <div className="highlights-grid">
                      {pack.villes?.map((ville, index) => (
                        <div key={index} className="highlight-item">
                          <MapPin size={18} />
                          <span>{ville}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="includes-excludes">
                    <div className="includes">
                      <h4>✓ Inclus</h4>
                      <ul>
                        {pack.includes?.map((item, index) => (
                          <li key={index}>
                            <CheckCircle size={16} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="excludes">
                      <h4>✗ Non inclus</h4>
                      <ul>
                        {pack.excludes?.map((item, index) => (
                          <li key={index}>
                            <AlertCircle size={16} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'itineraire' && (
                <div className="itinerary-content">
                  <div className="itinerary-timeline">
                    {(showFullItinerary ? pack.itineraires : pack.itineraires.slice(0, 3)).map((jour, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-day">
                          <span className="day-number">Jour {jour.jour}</span>
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-image">
                            <img src={jour.image} alt={jour.titre} />
                          </div>
                          <div className="timeline-info">
                            <h4>{jour.titre}</h4>
                            <p>{jour.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pack.itineraires.length > 3 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowFullItinerary(!showFullItinerary)}
                    >
                      {showFullItinerary ? (
                        <>Voir moins <ChevronUp size={16} /></>
                      ) : (
                        <>Voir l'itinéraire complet <ChevronDown size={16} /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'equipements' && (
                <div className="equipements-content">
                  <div className="equipements-grid">
                    {pack.equipements?.map((equip, index) => (
                      <div key={index} className="equipement-card">
                        <div className="equipement-icon">{equip.icon}</div>
                        <span>{equip.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'avis' && (
                <div className="reviews-content">
                  <div className="reviews-summary">
                    <div className="average-rating">
                      <span className="big-rating">{pack.note_moyenne}</span>
                      <span className="rating-max">/5</span>
                      <div className="rating-stars-large">
                        {getRatingStars(pack.note_moyenne)}
                      </div>
                      <p>Basé sur {pack.nb_avis} avis</p>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="reviewer-info">
                          <img src={review.avatar} alt={review.user} className="reviewer-avatar" />
                          <div>
                            <h4>{review.user}</h4>
                            <div className="reviewer-rating">
                              {getRatingStars(review.note)}
                            </div>
                          </div>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-comment">"{review.commentaire}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale - Réservation */}
          <div className="sidebar">
            <div className="booking-card">
              <div className="price-section">
                {pack.prix_promotion ? (
                  <>
                    <span className="old-price">{pack.prix}€</span>
                    <span className="new-price">{pack.prix_promotion}€</span>
                  </>
                ) : (
                  <span className="current-price">{pack.prix}€</span>
                )}
                <span className="price-unit">/ personne</span>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Users size={16} />
                    Nombre de personnes
                  </label>
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setNbPersonnes(Math.max(1, nbPersonnes - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{nbPersonnes}</span>
                    <button 
                      onClick={() => setNbPersonnes(Math.min(10, nbPersonnes + 1))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-section">
                  <span>Total</span>
                  <span className="total-price">{calculateTotal()}€</span>
                </div>

                <button 
                  className="reserve-btn"
                  onClick={handleReservation}
                  disabled={!selectedDate}
                >
                  Réserver maintenant
                </button>

                {!selectedDate && (
                  <p className="date-warning">
                    <AlertCircle size={14} />
                    Veuillez sélectionner une date
                  </p>
                )}
              </div>

              <div className="contact-info">
                <p>Une question ?</p>
                <div className="contact-buttons">
                  <button className="contact-btn phone">
                    <Phone size={16} />
                    Appeler
                  </button>
                  <button className="contact-btn email">
                    <Mail size={16} />
                    Email
                  </button>
                </div>
              </div>
            </div>

            <div className="guarantee-card">
              <Shield size={24} />
              <div>
                <h4>Garantie satisfait</h4>
                <p>Annulation gratuite jusqu'à 7 jours avant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pack-details-page {
          background: #faf7f2;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Fil d'Ariane */
        .breadcrumb {
          background: white;
          padding: 15px 0;
          border-bottom: 1px solid #eaeaea;
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-link {
          color: #666;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: #0f4c75;
        }

        .breadcrumb-current {
          color: #1e272e;
          font-weight: 500;
        }

        /* En-tête */
        .pack-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin: 30px 0;
        }

        .pack-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0 0 15px 0;
        }

        .pack-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .pack-location,
        .pack-duration {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
        }

        .pack-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #ddd;
        }

        .star.filled {
          color: #ffb84d;
        }

        .rating-score {
          font-weight: 700;
          color: #1e272e;
        }

        .rating-count {
          color: #999;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          width: 45px;
          height: 45px;
          border: 2px solid #eaeaea;
          border-radius: 50%;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.like:hover,
        .action-btn.like.liked {
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .action-btn.share:hover {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        /* Galerie */
        .gallery-section {
          margin-bottom: 40px;
        }

        .main-image {
          position: relative;
          height: 500px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .gallery-nav.prev {
          left: 20px;
        }

        .gallery-nav.next {
          right: 20px;
        }

        .gallery-nav:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .image-counter {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px 15px;
          border-radius: 50px;
          font-size: 0.9rem;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .thumbnail {
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          padding: 0;
        }

        .thumbnail.active {
          border-color: #bf5700;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Grille de contenu */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          margin-bottom: 50px;
        }

        /* Tabs */
        .tabs-nav {
          display: flex;
          gap: 20px;
          border-bottom: 2px solid #eaeaea;
          margin-bottom: 30px;
        }

        .tab-btn {
          padding: 10px 0;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          position: relative;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0f4c75, #bf5700);
          transition: width 0.3s ease;
        }

        .tab-btn.active {
          color: #0f4c75;
        }

        .tab-btn.active::after {
          width: 100%;
        }

        /* Description */
        .description-text {
          line-height: 1.8;
          color: #444;
          margin-bottom: 30px;
        }

        .highlights h3 {
          font-size: 1.2rem;
          margin-bottom: 15px;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .includes-excludes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 30px;
        }

        .includes h4,
        .excludes h4 {
          margin-bottom: 15px;
        }

        .includes ul,
        .excludes ul {
          list-style: none;
          padding: 0;
        }

        .includes li,
        .excludes li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          color: #666;
        }

        .includes li {
          color: #28a745;
        }

        .excludes li {
          color: #dc3545;
        }

        /* Itinéraire */
        .itinerary-timeline {
          margin-bottom: 20px;
        }

        .timeline-item {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .timeline-day {
          min-width: 80px;
        }

        .day-number {
          font-weight: 700;
          color: #0f4c75;
        }

        .timeline-content {
          flex: 1;
          display: flex;
          gap: 15px;
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .timeline-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
        }

        .timeline-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .timeline-info h4 {
          margin: 0 0 5px 0;
        }

        .timeline-info p {
          color: #666;
          font-size: 0.9rem;
        }

        .show-more-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          padding: 10px 20px;
          background: none;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .show-more-btn:hover {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        /* Équipements */
        .equipements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .equipement-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .equipement-icon {
          color: #0f4c75;
        }

        /* Avis */
        .reviews-summary {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .average-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .big-rating {
          font-size: 3rem;
          font-weight: 800;
          color: #0f4c75;
          line-height: 1;
        }

        .rating-max {
          color: #999;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-item {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .reviewer-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .reviewer-info h4 {
          margin: 0 0 5px 0;
        }

        .review-date {
          margin-left: auto;
          color: #999;
          font-size: 0.9rem;
        }

        .review-comment {
          color: #666;
          line-height: 1.6;
        }

        /* Sidebar */
        .sidebar {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .booking-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .price-section {
          text-align: center;
          margin-bottom: 25px;
        }

        .old-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
          margin-right: 10px;
        }

        .new-price,
        .current-price {
          font-size: 2rem;
          font-weight: 700;
          color: #bf5700;
        }

        .price-unit {
          color: #999;
          font-size: 0.9rem;
        }

        .booking-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e272e;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #0f4c75;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 10px;
          border: 2px solid #eaeaea;
          border-radius: 12px;
        }

        .quantity-btn {
          width: 35px;
          height: 35px;
          border: none;
          border-radius: 8px;
          background: #f8f9fa;
          color: #1e272e;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          background: #0f4c75;
          color: white;
        }

        .quantity-value {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .total-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          border-top: 2px solid #eaeaea;
          border-bottom: 2px solid #eaeaea;
          margin-bottom: 20px;
        }

        .total-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #bf5700;
        }

        .reserve-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .reserve-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(191, 87, 0, 0.3);
        }

        .reserve-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .date-warning {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          color: #bf5700;
          font-size: 0.9rem;
        }

        .contact-info {
          text-align: center;
        }

        .contact-info p {
          color: #666;
          margin-bottom: 10px;
        }

        .contact-buttons {
          display: flex;
          gap: 10px;
        }

        .contact-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 2px solid #eaeaea;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .contact-btn.phone:hover {
          border-color: #28a745;
          color: #28a745;
        }

        .contact-btn.email:hover {
          border-color: #0f4c75;
          color: #0f4c75;
        }

        .guarantee-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          border-radius: 16px;
        }

        .guarantee-card h4 {
          margin: 0 0 5px 0;
          color: #1e272e;
        }

        .guarantee-card p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .pack-header {
            flex-direction: column;
            gap: 15px;
          }

          .pack-title {
            font-size: 1.5rem;
          }

          .pack-meta {
            gap: 10px;
          }

          .main-image {
            height: 300px;
          }

          .thumbnail-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tabs-nav {
            overflow-x: auto;
            padding-bottom: 5px;
          }

          .tab-btn {
            white-space: nowrap;
          }

          .includes-excludes {
            grid-template-columns: 1fr;
          }

          .timeline-item {
            flex-direction: column;
            gap: 10px;
          }

          .timeline-content {
            flex-direction: column;
          }

          .timeline-image {
            width: 100%;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default PackDetails;