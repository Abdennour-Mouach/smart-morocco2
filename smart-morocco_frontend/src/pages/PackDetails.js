import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  MapPin, Clock, Star, CheckCircle, Hotel,
  ClipboardList, ChevronLeft, Calendar, Users,
  ShieldCheck, PhoneCall, HeartHandshake, X
} from "lucide-react";
import api from "../services/api";
import Footer from "./Footer";

const PackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);
  const [hebergement, setHebergement] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [activite, setActivite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [departDate, setDepartDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveMessage, setReserveMessage] = useState("");

  const parsePlanning = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchPack = async () => {
      setIsLoading(true);
      try {
        const packRes = await api.get(`/api/packs/${id}`);
        const packData = packRes.data;
        setPack(packData);

        const requests = [];
        if (packData.id_hebergement) {
          requests.push(api.get(`/api/hebergements/${packData.id_hebergement}`));
        } else {
          requests.push(Promise.resolve({ data: null }));
        }

        if (packData.id_restaurant) {
          requests.push(api.get(`/api/restaurations/${packData.id_restaurant}`));
        } else {
          requests.push(Promise.resolve({ data: null }));
        }

        if (packData.id_activite) {
          requests.push(api.get(`/api/activites/${packData.id_activite}`));
        } else {
          requests.push(Promise.resolve({ data: null }));
        }

        const [hebRes, restRes, actRes] = await Promise.all(requests);
        setHebergement(hebRes.data);
        setRestaurant(restRes.data);
        setActivite(actRes.data);
      } catch (err) {
        console.error("Erreur lors du chargement du pack:", err);
        setPack(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPack();
  }, [id]);

  const toImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads/")) return `http://localhost:5006${url}`;
    return url;
  };

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id_utilisateur || user?.id || "";
    } catch (err) {
      return "";
    }
  };

  const openReservationModal = () => {
    setReserveMessage("");

    if (!getCurrentUserId()) {
      navigate("/login");
      return;
    }

    if (!departDate) {
      setReserveMessage("Veuillez choisir une date de depart avant de confirmer.");
      return;
    }

    setShowReserveModal(true);
  };

  const confirmReservation = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!departDate) {
      setReserveMessage("Veuillez choisir une date de depart.");
      return;
    }

    setReserveLoading(true);
    setReserveMessage("");

    try {
      const payload = {
        idUtilisateur: Number(userId),
        idPack: Number(id),
        nbPersonnes: Number(persons) || 1,
        dateDebut: departDate,
        modePaiement: "Carte bancaire",
      };

      const res = await api.post("/reservations", payload);
      setShowReserveModal(false);
      setReserveMessage("Réservation confirmée avec succès.");
      navigate("/reservations", { state: { reservation: res.data } });
    } catch (err) {
      console.error("Erreur lors de la réservation:", err);
      setReserveMessage(
        err.response?.data || "La réservation a échoué. Veuillez réessayer."
      );
    } finally {
      setReserveLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="loading-screen">
          <div className="loading-ring">
            <div /><div /><div /><div />
          </div>
          <p className="loading-text">Preparation de votre voyage...</p>
        </div>
        <style>{loadingStyles}</style>
      </>
    );
  }

  if (!pack) {
    return (
      <>
        <div className="not-found">
          <span className="nf-icon">*</span>
          <h2>Pack introuvable</h2>
          <Link to="/packs" className="back-btn">
            <ChevronLeft size={16} /> Retour aux packs
          </Link>
        </div>
        <style>{notFoundStyles}</style>
      </>
    );
  }

  const images = (() => {
    if (pack.imageUrl) return [toImageUrl(pack.imageUrl)];
    if (pack.images?.length > 0) return pack.images.map(toImageUrl);
    if (pack.imagePrincipale) return [toImageUrl(pack.imagePrincipale)];
    return ["/images/ESSAOUIRA.jpg"];
  })();

  const hebergementImage = toImageUrl(hebergement?.imageUrl);
  const restaurantImage = toImageUrl(restaurant?.imageurl || restaurant?.imageUrl);
  const activiteImage = toImageUrl(activite?.imageUrl) || "/images/AitHaddou.jpg";

  const thumbs = [
    { src: images[0], label: "Vue principale" },
    { src: hebergementImage, label: "Hebergement" },
    { src: restaurantImage, label: "Restaurant" },
    { src: activiteImage, label: "Activite" },
  ].filter((item) => item.src);

  const heroImage = thumbs[activeThumb]?.src || images[0];
  const total = Math.max(Number(persons || 1), 1) * Number(pack.prixTotal || 0);
  const planning = parsePlanning(pack.planning);

  const inclusions = [
    {
      icon: <Hotel size={18} />,
      title: "Hebergement",
      image: hebergementImage,
      detail: hebergement?.nomHibergement || hebergement?.type || "Non defini",
    },
    {
      icon: <ClipboardList size={18} />,
      title: "Restauration",
      image: restaurantImage,
      detail: restaurant
        ? `${restaurant.nomRestauration} · ${restaurant.typeCuisine || "Cuisine marocaine"}`
        : "Non defini",
    },
    {
      icon: <ClipboardList size={18} />,
      title: "Activites",
      image: activiteImage,
      detail: activite?.nomActivity || activite?.nom || "Non defini",
    },
  ].filter((item) => item.detail !== "Non defini" || item.image);

  const guarantees = [
    { icon: <ShieldCheck size={20} />, title: "Paiement securise", desc: "Transactions protegees et donnees chiffrees." },
    { icon: <PhoneCall size={20} />, title: "Assistance 24h/24", desc: "Un conseiller disponible a tout moment." },
    { icon: <HeartHandshake size={20} />, title: "Service premium", desc: "Accompagnement personnalise de bout en bout." },
  ];

  return (
    <>
      <div className="pd-root">
        <header className="pd-hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="pd-hero-veil" />
          <div className="pd-hero-inner">
            <Link to="/packs" className="pd-back">
              <ChevronLeft size={15} /> Tous les packs
            </Link>
            <div className="pd-hero-body">
              <p className="pd-hero-eyebrow">
                <MapPin size={13} /> {pack.destination || "Maroc"}
              </p>
              <h1 className="pd-hero-title">{pack.nomPack}</h1>
              <div className="pd-hero-badges">
                <span className="badge">
                  <Clock size={13} /> {pack.duree ? `${pack.duree} jours` : "Duree flexible"}
                </span>
                <span className="badge badge-gold">
                  <Star size={13} /> {pack.noteMoyenne || "4.8"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="pd-layout">
          <main className="pd-main">
            <section className="pd-card pd-gallery">
              <div className="gallery-stage">
                <img src={heroImage} alt={pack.nomPack} className="gallery-main" />
                <div className="gallery-label">{thumbs[activeThumb]?.label}</div>
              </div>
              <div className="gallery-strip">
                {thumbs.map((thumb, index) => (
                  <button
                    key={index}
                    className={`gallery-thumb ${index === activeThumb ? "active" : ""}`}
                    onClick={() => setActiveThumb(index)}
                  >
                    <img src={thumb.src} alt={thumb.label} />
                    {index === activeThumb && <span className="thumb-active-bar" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="pd-card">
              <div className="section-header">
                <span className="section-ornament">*</span>
                <h2>A propos de ce voyage</h2>
              </div>
              <p className="pd-desc">{pack.description}</p>
            </section>

            <section className="pd-card">
              <div className="section-header">
                <span className="section-ornament">*</span>
                <h2>Services inclus</h2>
              </div>
              <div className="inclusion-grid">
                {inclusions.map((inc, index) => (
                  <div className="inclusion-card" key={index}>
                    <div className="inc-img-wrap">
                      {inc.image ? <img src={inc.image} alt={inc.title} /> : <div className="inc-img-fallback">{inc.icon}</div>}
                      <div className="inc-img-overlay" />
                    </div>
                    <div className="inc-body">
                      <p className="inc-category">{inc.icon} {inc.title}</p>
                      <p className="inc-detail">
                        <CheckCircle size={13} className="inc-check" /> {inc.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {planning.length > 0 && (
              <section className="pd-card">
                <div className="section-header">
                  <span className="section-ornament">*</span>
                  <h2>Planning du voyage</h2>
                </div>
                <div className="planning-grid">
                  {planning.map((day, index) => (
                    <div className="planning-day-card" key={index}>
                      <div className="planning-day-head">
                        <span className="planning-day-index">Jour {day.day || index + 1}</span>
                        <strong>{day.title || `Jour ${day.day || index + 1}`}</strong>
                      </div>
                      <div className="planning-day-body">
                        {day.matin && <p><span>Matin:</span> {day.matin}</p>}
                        {day.apresMidi && <p><span>Après-midi:</span> {day.apresMidi}</p>}
                        {day.soir && <p><span>Soir:</span> {day.soir}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="pd-card pd-guarantees">
              <div className="section-header">
                <span className="section-ornament">*</span>
                <h2>Nos engagements</h2>
              </div>
              <div className="guarantee-row">
                {guarantees.map((item, index) => (
                  <div className="guarantee-block" key={index}>
                    <div className="g-icon-wrap">{item.icon}</div>
                    <h4 className="g-title">{item.title}</h4>
                    <p className="g-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="pd-sidebar">
            <div className="price-card">
              <div className="price-header">
                <p className="price-label">Prix par personne</p>
                <div className="price-amount">
                  {Number(pack.prixTotal || 0).toLocaleString("fr-FR")}
                  <span className="price-currency"> MAD</span>
                </div>
              </div>

              <div className="price-divider" />

              <div className="booking-fields">
                <div className="booking-field">
                  <label>
                    <span className="field-label"><Calendar size={13} /> Date de depart</span>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                    />
                  </label>
                </div>
                  <div className="booking-field">
                    <label>
                      <span className="field-label"><Users size={13} /> Voyageurs</span>
                      <div className="counter-wrap">
                      <button type="button" className="counter-btn" onClick={() => setPersons((p) => Math.max(1, p - 1))}>-</button>
                      <span className="counter-val">{persons}</span>
                      <button type="button" className="counter-btn" onClick={() => setPersons((p) => p + 1)}>+</button>
                      </div>
                    </label>
                  </div>
                </div>

              <div className="price-divider" />

              <div className="price-summary">
                <div className="ps-row">
                  <span>{persons} x {Number(pack.prixTotal || 0).toLocaleString("fr-FR")} MAD</span>
                  <span>{total.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="ps-row ps-total">
                  <span>Total</span>
                  <span>{total.toLocaleString("fr-FR")} MAD</span>
                </div>
              </div>

              <button type="button" className="cta-btn" onClick={openReservationModal}>
                Reserver maintenant
                <span className="cta-arrow"></span>
              </button>
              <p className="cta-note">Aucun frais cache · Annulation flexible</p>
              {reserveMessage && <p className="reserve-feedback">{reserveMessage}</p>}
            </div>
          </aside>
        </div>
      </div>

      {showReserveModal && (
        <div className="reserve-modal-overlay" onClick={() => !reserveLoading && setShowReserveModal(false)}>
          <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reserve-modal-header">
              <div>
                <p className="reserve-kicker">Confirmation de réservation</p>
                <h3>{pack.nomPack}</h3>
              </div>
              <button
                type="button"
                className="reserve-close"
                onClick={() => setShowReserveModal(false)}
                disabled={reserveLoading}
              >
                <X size={18} />
              </button>
            </div>

            <div className="reserve-modal-body">
              <div className="reserve-summary-card">
                <div className="reserve-summary-row">
                  <span>Destination</span>
                  <strong>{pack.destination || "Maroc"}</strong>
                </div>
                <div className="reserve-summary-row">
                  <span>Date de départ</span>
                  <strong>{departDate}</strong>
                </div>
                <div className="reserve-summary-row">
                  <span>Voyageurs</span>
                  <strong>{persons}</strong>
                </div>
                <div className="reserve-summary-row total">
                  <span>Total</span>
                  <strong>{total.toLocaleString("fr-FR")} MAD</strong>
                </div>
              </div>
              <p className="reserve-note">
                En confirmant, votre réservation sera enregistrée avec votre compte utilisateur et le pack choisi.
              </p>
            </div>

            <div className="reserve-modal-actions">
              <button
                type="button"
                className="reserve-cancel"
                onClick={() => setShowReserveModal(false)}
                disabled={reserveLoading}
              >
                Annuler
              </button>
              <button
                type="button"
                className="reserve-confirm"
                onClick={confirmReservation}
                disabled={reserveLoading}
              >
                {reserveLoading ? "Enregistrement..." : "Confirmer la réservation"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{styles}</style>
    </>
  );
};

const loadingStyles = `
  .loading-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8f5ef;
    gap: 24px;
  }
  .loading-ring {
    display: inline-block;
    position: relative;
    width: 56px;
    height: 56px;
  }
  .loading-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 44px;
    height: 44px;
    margin: 6px;
    border: 3px solid transparent;
    border-top-color: #8b6914;
    border-radius: 50%;
    animation: ring-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loading-ring div:nth-child(1) { animation-delay: -0.45s; }
  .loading-ring div:nth-child(2) { animation-delay: -0.3s; }
  .loading-ring div:nth-child(3) { animation-delay: -0.15s; }
  @keyframes ring-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .loading-text { color: #6b5c3e; font-size: 1.1rem; font-style: italic; }
`;

const notFoundStyles = `
  .not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #f8f5ef;
  }
  .nf-icon { font-size: 2rem; color: #8b6914; }
  .not-found h2 { font-size: 1.6rem; color: #2c1d0e; margin: 0; }
  .back-btn { color: #8b6914; text-decoration: none; }
`;

const styles = `
  .pd-root {
    background: #f8f5ef;
    min-height: 100vh;
    color: #2c1d0e;
  }
  .pd-hero {
    position: relative;
    height: 480px;
    background-size: cover;
    background-position: center;
  }
  .pd-hero-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(20,12,5,0.25), rgba(20,12,5,0.85));
  }
  .pd-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1260px;
    margin: 0 auto;
    padding: 36px 40px 48px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
  }
  .pd-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #d4aa55;
    margin-bottom: 10px;
  }
  .pd-hero-title {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    color: #fff;
    margin-bottom: 18px;
  }
  .pd-hero-badges {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.15);
    color: #fff;
    padding: 6px 14px;
    border-radius: 100px;
  }
  .badge-gold {
    background: rgba(212,170,85,0.25);
    color: #f0d080;
  }
  .pd-layout {
    max-width: 1260px;
    margin: 0 auto;
    padding: 48px 40px 80px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 40px;
    align-items: start;
  }
  .pd-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 28px;
    box-shadow: 0 2px 24px rgba(44,29,14,0.07);
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
  }
  .section-ornament {
    color: #d4aa55;
    font-size: 0.7rem;
  }
  .section-header h2 {
    font-size: 1.55rem;
    color: #2c1d0e;
  }
  .pd-gallery { padding: 20px; }
  .gallery-stage {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    height: 360px;
  }
  .gallery-main {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .gallery-label {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(20,12,5,0.55);
    color: #fff;
    padding: 5px 14px;
    border-radius: 100px;
  }
  .gallery-strip {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
  }
  .gallery-thumb {
    position: relative;
    flex-shrink: 0;
    width: 110px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    background: none;
    padding: 0;
  }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .gallery-thumb.active { border-color: #d4aa55; }
  .thumb-active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #d4aa55, #c9843c);
  }
  .pd-desc {
    font-size: 0.97rem;
    line-height: 1.8;
    color: #5a4535;
  }
  .inclusion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .inclusion-card {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #ede8df;
  }
  .inc-img-wrap {
    position: relative;
    height: 100px;
    background: #e8e0d4;
  }
  .inc-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .inc-img-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a89070;
    background: #f0ebe3;
  }
  .inc-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(20,12,5,0.35));
  }
  .inc-body { padding: 14px 16px; }
  .inc-category {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #c9843c;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .inc-detail {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 0.88rem;
    color: #5a4535;
    line-height: 1.5;
  }
  .inc-check { color: #8b9e3a; flex-shrink: 0; margin-top: 2px; }
  .planning-grid {
    display: grid;
    gap: 14px;
  }
  .planning-day-card {
    border: 1px solid #ede8df;
    border-radius: 14px;
    padding: 16px;
    background: linear-gradient(180deg, #fff 0%, #faf7f2 100%);
  }
  .planning-day-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .planning-day-index {
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #c9843c;
  }
  .planning-day-body p {
    margin: 0 0 8px;
    color: #5a4535;
    line-height: 1.6;
  }
  .planning-day-body span {
    font-weight: 700;
    color: #2c1d0e;
  }
  .pd-guarantees {
    background: linear-gradient(145deg, #2c1d0e, #4a3020);
    color: #fff;
  }
  .pd-guarantees .section-header h2 { color: #f5e9d0; }
  .guarantee-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .guarantee-block {
    text-align: center;
    padding: 20px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.07);
  }
  .g-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(212,170,85,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: #d4aa55;
  }
  .g-title { font-size: 1.05rem; color: #f5e9d0; margin-bottom: 6px; }
  .g-desc { font-size: 0.82rem; color: rgba(245,233,208,0.65); line-height: 1.6; }
  .pd-sidebar { position: sticky; top: 32px; }
  .price-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 32px rgba(44,29,14,0.1);
    border: 1px solid #ede8df;
  }
  .price-header {
    padding: 28px 28px 24px;
    background: linear-gradient(135deg, #2c1d0e 0%, #4a3020 100%);
  }
  .price-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: rgba(212,170,85,0.8);
    margin-bottom: 8px;
  }
  .price-amount { font-size: 2.8rem; color: #fff; line-height: 1; }
  .price-currency { font-size: 1.2rem; color: rgba(255,255,255,0.6); }
  .price-divider { height: 1px; background: #ede8df; }
  .booking-fields { padding: 22px 28px; display: grid; gap: 18px; }
  .booking-field label { display: grid; gap: 8px; }
  .field-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.78rem;
    text-transform: uppercase;
    color: #8b7355;
  }
  .booking-field input[type="date"] {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e4ddd4;
    border-radius: 10px;
    color: #2c1d0e;
    background: #faf7f2;
    outline: none;
  }
  .counter-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid #e4ddd4;
    border-radius: 10px;
    overflow: hidden;
    background: #faf7f2;
  }
  .counter-btn {
    background: none;
    border: none;
    width: 42px;
    height: 42px;
    cursor: pointer;
    color: #8b6914;
  }
  .counter-val {
    flex: 1;
    text-align: center;
    border-left: 1px solid #e4ddd4;
    border-right: 1px solid #e4ddd4;
    line-height: 42px;
  }
  .price-summary { padding: 18px 28px; display: grid; gap: 10px; }
  .ps-row { display: flex; justify-content: space-between; color: #8b7355; }
  .ps-total {
    font-size: 1.05rem;
    color: #2c1d0e;
    font-weight: 600;
    padding-top: 10px;
    border-top: 1px solid #ede8df;
  }
  .cta-btn {
    width: calc(100% - 56px);
    margin: 0 28px 8px;
    padding: 16px 24px;
    background: linear-gradient(135deg, #2c1d0e 0%, #8b6914 50%, #c9843c 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
  .cta-note {
    text-align: center;
    font-size: 0.75rem;
    color: #a89070;
    padding: 0 28px 22px;
  }
  .reserve-feedback {
    margin: 0 28px 20px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #eef6fb;
    color: #0f4c75;
    font-size: 0.88rem;
  }
  .reserve-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 12, 5, 0.55);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }
  .reserve-modal {
    width: 100%;
    max-width: 520px;
    background: #fff;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.22);
  }
  .reserve-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 16px;
    padding: 22px 24px;
    border-bottom: 1px solid #ede8df;
    background: linear-gradient(135deg, #faf7f2, #fff);
  }
  .reserve-kicker {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #c9843c;
    margin-bottom: 6px;
  }
  .reserve-modal-header h3 {
    font-size: 1.35rem;
    color: #2c1d0e;
    margin: 0;
  }
  .reserve-close {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 999px;
    background: #f1f5f9;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .reserve-modal-body {
    padding: 22px 24px;
  }
  .reserve-summary-card {
    border: 1px solid #ede8df;
    border-radius: 18px;
    padding: 16px;
    background: #faf7f2;
    display: grid;
    gap: 12px;
  }
  .reserve-summary-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: #5a4535;
  }
  .reserve-summary-row strong {
    color: #2c1d0e;
  }
  .reserve-summary-row.total {
    padding-top: 12px;
    border-top: 1px solid #e8dfd4;
    font-size: 1.05rem;
  }
  .reserve-note {
    margin-top: 14px;
    font-size: 0.88rem;
    color: #6b5c4b;
    line-height: 1.6;
  }
  .reserve-modal-actions {
    display: flex;
    gap: 12px;
    padding: 0 24px 24px;
  }
  .reserve-cancel,
  .reserve-confirm {
    flex: 1;
    border: none;
    border-radius: 12px;
    padding: 14px 18px;
    cursor: pointer;
    font-weight: 600;
  }
  .reserve-cancel {
    background: #f1f5f9;
    color: #334155;
  }
  .reserve-confirm {
    background: linear-gradient(135deg, #0f4c75, #bf5700);
    color: #fff;
  }
  .reserve-confirm:disabled,
  .reserve-cancel:disabled,
  .reserve-close:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 1080px) {
    .pd-layout {
      grid-template-columns: 1fr;
      padding: 32px 24px 60px;
    }
    .pd-sidebar { position: static; }
  }
  @media (max-width: 700px) {
    .pd-hero { height: 380px; }
    .pd-hero-inner { padding: 24px 20px 32px; }
    .pd-card { padding: 22px 18px; }
    .inclusion-grid { grid-template-columns: 1fr; }
    .guarantee-row { grid-template-columns: 1fr; }
    .gallery-stage { height: 240px; }
    .reserve-modal-actions { flex-direction: column; }
  }
`;

export default PackDetails;
