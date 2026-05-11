import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Plus, Trash2, X, Search, Package, MapPin, Calendar, Upload, Check } from "lucide-react";

const serviceOptions = [
  { key: "hebergement", label: "Hebergement" },
  { key: "restauration", label: "Restauration" },
  { key: "activites", label: "Activites" },
];

const initialForm = {
  id: "",
  nomPack: "",
  destination: "",
  duree: "",
  description: "",
  planning: "",
  imageUrl: "",
  hebergementId: "",
  restaurationId: "",
  activiteIds: [],
};

const createPlanningDay = (day) => ({
  day,
  title: `Jour ${day}`,
  matin: "",
  apresMidi: "",
  soir: "",
});

const cityAliases = [
  { key: "casablanca", label: "Casablanca", aliases: ["casa", "casablanca", "dar bida"] },
  { key: "marrakech", label: "Marrakech", aliases: ["marrakech", "marrakesh"] },
  { key: "fes", label: "Fes", aliases: ["fes", "fez", "fes city"] },
  { key: "rabat", label: "Rabat", aliases: ["rabat"] },
  { key: "agadir", label: "Agadir", aliases: ["agadir"] },
  { key: "tanger", label: "Tanger", aliases: ["tanger", "tangier"] },
  { key: "essaouira", label: "Essaouira", aliases: ["essaouira"] },
  { key: "chefchaouen", label: "Chefchaouen", aliases: ["chefchaouen", "chaouen"] },
  { key: "meknes", label: "Meknes", aliases: ["meknes"] },
  { key: "ouarzazate", label: "Ouarzazate", aliases: ["ouarzazate"] },
];

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const resolveCity = (value = "") => {
  const normalized = normalizeText(value);
  if (!normalized) return "";

  const match = cityAliases.find((city) =>
    city.aliases.some((alias) => normalized.includes(normalizeText(alias)))
  );

  return match?.label || "";
};

const matchesCity = (value = "", city = "") => {
  if (!city) return true;
  const normalizedValue = normalizeText(value);
  const normalizedCity = normalizeText(city);
  if (!normalizedValue) return false;

  const cityInfo = cityAliases.find(
    (item) => normalizeText(item.label) === normalizedCity || item.aliases.some((alias) => normalizeText(alias) === normalizedCity)
  );

  const cityTerms = cityInfo ? [cityInfo.label, ...cityInfo.aliases] : [city];
  return cityTerms.some((term) => normalizedValue.includes(normalizeText(term)));
};

const toImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `http://localhost:5006${url}`;
  return url;
};

const Pack = () => {
  const [items, setItems] = useState([]);
  const [hebergements, setHebergements] = useState([]);
  const [restaurations, setRestaurations] = useState([]);
  const [activites, setActivites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState(initialForm);
  const [planningDays, setPlanningDays] = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [packsRes, hebRes, resRes, actRes] = await Promise.all([
        api.get("/api/packs"),
        api.get("/api/hebergements"),
        api.get("/api/restaurations"),
        api.get("/api/activites"),
      ]);

      setItems(Array.isArray(packsRes.data) ? packsRes.data : []);
      setHebergements(Array.isArray(hebRes.data) ? hebRes.data : []);
      setRestaurations(Array.isArray(resRes.data) ? resRes.data : []);
      setActivites(Array.isArray(actRes.data) ? actRes.data : []);
    } catch (e) {
      console.error("Erreur lors du chargement des donnees:", e);
      setError("Impossible de charger les donnees.");
      setItems([]);
      setHebergements([]);
      setRestaurations([]);
      setActivites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const inferredDestination = resolveCity(form.nomPack);
    if (!form.destination && inferredDestination) {
      setForm((prev) => ({ ...prev, destination: inferredDestination }));
    }
  }, [form.nomPack, form.destination]);

  useEffect(() => {
    const duration = Number(form.duree) || 0;
    if (!duration) return;

    setPlanningDays((prev) => {
      if (prev.length >= duration) return prev;

      const next = [...prev];
      for (let i = prev.length + 1; i <= duration; i += 1) {
        next.push(createPlanningDay(i));
      }
      return next;
    });
  }, [form.duree]);

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setPlanningDays([]);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data?.url || res.data?.filePath || null;
    } catch (e) {
      console.error("Upload echoue", e);
      setError("Upload image echoue.");
      return null;
    }
  };

  const includedServices = {
    hebergement: Boolean(form.hebergementId),
    restauration: Boolean(form.restaurationId),
    activites: form.activiteIds.length > 0,
  };

  const toggleService = (serviceKey) => {
    setForm((prev) => {
      if (serviceKey === "hebergement") {
        return {
          ...prev,
          hebergementId: prev.hebergementId ? "" : (filteredHebergements[0]?.id ? String(filteredHebergements[0].id) : ""),
        };
      }

      if (serviceKey === "restauration") {
        return {
          ...prev,
          restaurationId: prev.restaurationId ? "" : (filteredRestaurations[0]?.id ? String(filteredRestaurations[0].id) : ""),
        };
      }

      if (serviceKey === "activites") {
        return {
          ...prev,
          activiteIds: prev.activiteIds.length ? [] : (filteredActivites[0]?.id ? [String(filteredActivites[0].id)] : []),
        };
      }

      return prev;
    });
  };

  const toggleActivite = (activiteId) => {
    const value = String(activiteId);
    setForm((prev) => ({
      ...prev,
      activiteIds: prev.activiteIds.includes(value)
        ? prev.activiteIds.filter((id) => id !== value)
        : [...prev.activiteIds, value],
    }));
  };

  const addPlanningDay = () => {
    setPlanningDays((prev) => [...prev, createPlanningDay(prev.length + 1)]);
  };

  const removePlanningDay = (index) => {
    setPlanningDays((prev) =>
      prev
        .filter((_, currentIndex) => currentIndex !== index)
        .map((day, dayIndex) => ({ ...day, day: dayIndex + 1, title: day.title || `Jour ${dayIndex + 1}` }))
    );
  };

  const updatePlanningDay = (index, field, value) => {
    setPlanningDays((prev) =>
      prev.map((day, currentIndex) =>
        currentIndex === index ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let imageUrl = form.imageUrl;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;
    }

    if (!imageUrl) {
      setError("Image non envoyee.");
      return;
    }

    const payload = {
      nomPack: form.nomPack,
      destination: form.destination,
      duree: form.duree ? Number(form.duree) : 0,
      description: form.description,
      planning: JSON.stringify(
        planningDays
          .map((day) => ({
            day: Number(day.day) || 0,
            title: day.title || `Jour ${day.day}`,
            matin: day.matin || "",
            apresMidi: day.apresMidi || "",
            soir: day.soir || "",
          }))
          .filter((day) => day.matin || day.apresMidi || day.soir || day.title)
      ),
      imageUrl,
      hebergementId: form.hebergementId ? Number(form.hebergementId) : null,
      restaurationId: form.restaurationId ? Number(form.restaurationId) : null,
      activiteIds: form.activiteIds.map((id) => Number(id)),
    };

    try {
      await api.post("/api/packs/compose", payload);
      resetForm();
      load();
    } catch (e2) {
      console.error(e2);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce pack ?")) return;
    try {
      await api.delete(`/api/packs/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = items.filter((item) =>
    (item.nomPack || "").toLowerCase().includes(search.toLowerCase())
  );

  const detectedCity = resolveCity(form.destination || form.nomPack);

  const filteredHebergements = useMemo(
    () =>
      detectedCity
        ? hebergements.filter((item) => matchesCity(item.lieu || item.adresse || item.nomHibergement || "", detectedCity))
        : hebergements,
    [detectedCity, hebergements]
  );

  const filteredRestaurations = useMemo(
    () =>
      detectedCity
        ? restaurations.filter((item) =>
            matchesCity(
              [item.nomRestauration, item.typeCuisine, item.description, item.lieu].filter(Boolean).join(" "),
              detectedCity
            )
          )
        : restaurations,
    [detectedCity, restaurations]
  );

  const filteredActivites = useMemo(
    () =>
      detectedCity
        ? activites.filter((item) =>
            matchesCity([item.nomActivity, item.lieu, item.description].filter(Boolean).join(" "), detectedCity)
          )
        : activites,
    [activites, detectedCity]
  );

  const visibleHebergements = useMemo(
    () => (detectedCity ? filteredHebergements : []),
    [detectedCity, filteredHebergements]
  );
  const visibleRestaurations = useMemo(
    () => (detectedCity ? filteredRestaurations : []),
    [detectedCity, filteredRestaurations]
  );
  const visibleActivites = useMemo(
    () => (detectedCity ? filteredActivites : []),
    [detectedCity, filteredActivites]
  );
  const firstHebergementId = visibleHebergements[0]?.id ? String(visibleHebergements[0].id) : "";
  const firstRestaurationId = visibleRestaurations[0]?.id ? String(visibleRestaurations[0].id) : "";
  const firstActiviteId = visibleActivites[0]?.id ? String(visibleActivites[0].id) : "";

  useEffect(() => {
    setForm((prev) => {
      let changed = false;
      const next = { ...prev };

      if (includedServices.hebergement && !prev.hebergementId && firstHebergementId) {
        next.hebergementId = firstHebergementId;
        changed = true;
      }

      if (includedServices.restauration && !prev.restaurationId && firstRestaurationId) {
        next.restaurationId = firstRestaurationId;
        changed = true;
      }

      if (includedServices.activites && prev.activiteIds.length === 0 && firstActiviteId) {
        next.activiteIds = [firstActiviteId];
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [
    includedServices.hebergement,
    includedServices.restauration,
    includedServices.activites,
    firstHebergementId,
    firstRestaurationId,
    firstActiviteId,
  ]);

  useEffect(() => {
    setForm((prev) => {
      const next = { ...prev };
      let changed = false;

      if (prev.hebergementId && !visibleHebergements.some((item) => String(item.id) === String(prev.hebergementId))) {
        next.hebergementId = "";
        changed = true;
      }

      if (prev.restaurationId && !visibleRestaurations.some((item) => String(item.id) === String(prev.restaurationId))) {
        next.restaurationId = "";
        changed = true;
      }

      if (prev.activiteIds.length) {
        const allowedIds = new Set(visibleActivites.map((item) => String(item.id)));
        const nextActivites = prev.activiteIds.filter((id) => allowedIds.has(String(id)));
        if (nextActivites.length !== prev.activiteIds.length) {
          next.activiteIds = nextActivites;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [detectedCity, visibleHebergements, visibleRestaurations, visibleActivites]);

  const selectedHebergement = visibleHebergements.find((item) => String(item.id) === String(form.hebergementId));
  const selectedRestauration = visibleRestaurations.find((item) => String(item.id) === String(form.restaurationId));
  const selectedActivites = visibleActivites.filter((item) => form.activiteIds.includes(String(item.id)));

  const totalCalcule = (() => {
    let total = 0;
    const duree = Number(form.duree) || 0;
    if (selectedHebergement) total += (selectedHebergement.prixParNuit || 0) * Math.max(duree, 1);
    if (selectedRestauration) total += selectedRestauration.prix || 0;
    if (selectedActivites.length) total += selectedActivites.reduce((sum, item) => sum + (item.prix || 0), 0);
    return total;
  })();

  const formatPrice = (prix) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(prix || 0);

  return (
    <div className="pack-crud">
      <div className="crud-header">
        <h1><span className="header-icon">P</span> Gestion des packs</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}><Plus size={18} /> Nouveau pack</button>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Créer un pack</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="pack-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du pack *</label>
                  <input name="nomPack" value={form.nomPack} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input name="destination" value={form.destination} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Durée (jours)</label>
                  <input name="duree" type="number" value={form.duree} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Services inclus</label>
                  {detectedCity && (
                    <div className="city-hint">
                      Ville détectée: <strong>{detectedCity}</strong>
                    </div>
                  )}
                  <div className="services-grid">
                    {serviceOptions.map((service) => (
                      <button
                        key={service.key}
                        type="button"
                        className={`service-toggle ${includedServices[service.key] ? "active" : ""}`}
                        onClick={() => toggleService(service.key)}
                      >
                        <span className="service-checkbox">
                          {includedServices[service.key] && <Check size={14} />}
                        </span>
                        <span>{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {includedServices.hebergement && (
                <div className="form-group">
                  <label>Choisir un hébergement</label>
                  {detectedCity ? (
                    <>
                      <div className="option-hint">Cliquez sur une carte pour sélectionner l'hébergement.</div>
                      <div className="option-grid">
                        {visibleHebergements.map((item) => {
                          const active = String(form.hebergementId) === String(item.id);
                          const cover = toImageUrl(item.imageUrl);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`option-card ${active ? "active" : ""}`}
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  hebergementId: String(prev.hebergementId) === String(item.id) ? "" : String(item.id),
                                }))
                              }
                            >
                              <div className="option-media">
                                {cover ? <img src={cover} alt={item.nomHibergement} /> : <Package size={20} />}
                                <span className="option-check">
                                  {active && <Check size={13} />}
                                </span>
                              </div>
                              <div className="option-body">
                                <strong>{item.nomHibergement}</strong>
                                <span>{item.lieu || item.adresse || detectedCity}</span>
                                <em>{formatPrice(item.prixParNuit)}/nuit</em>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {visibleHebergements.length === 0 && (
                        <small className="filter-note error">Aucun hébergement trouvé pour {detectedCity}.</small>
                      )}
                    </>
                  ) : (
                    <div className="planning-empty">Aucune ville détectée.</div>
                  )}
                </div>
              )}

              {includedServices.restauration && (
                <div className="form-group">
                  <label>Choisir une restauration</label>
                  {detectedCity ? (
                    <>
                      <div className="option-hint">Choisissez le restaurant qui correspond au pack.</div>
                      <div className="option-grid">
                        {visibleRestaurations.map((item) => {
                          const active = String(form.restaurationId) === String(item.id);
                          const cover = toImageUrl(item.imageurl);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`option-card ${active ? "active" : ""}`}
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  restaurationId: String(prev.restaurationId) === String(item.id) ? "" : String(item.id),
                                }))
                              }
                            >
                              <div className="option-media">
                                {cover ? <img src={cover} alt={item.nomRestauration} /> : <Package size={20} />}
                                <span className="option-check">
                                  {active && <Check size={13} />}
                                </span>
                              </div>
                              <div className="option-body">
                                <strong>{item.nomRestauration}</strong>
                                <span>{item.lieu || detectedCity}</span>
                                <em>{formatPrice(item.prix)}</em>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {visibleRestaurations.length === 0 && (
                        <small className="filter-note error">Aucune restauration trouvée pour {detectedCity}.</small>
                      )}
                    </>
                  ) : (
                    <div className="planning-empty">Aucune ville détectée.</div>
                  )}
                </div>
              )}

              {includedServices.activites && (
                <div className="form-group">
                  <label>Choisir les activités incluses</label>
                  <div className="activity-grid">
                    {detectedCity ? (
                      visibleActivites.map((item) => {
                        const checked = form.activiteIds.includes(String(item.id));
                        const cover = toImageUrl(item.imageUrl);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`option-card activity-card ${checked ? "active" : ""}`}
                            onClick={() => toggleActivite(item.id)}
                          >
                            <div className="option-media">
                              {cover ? <img src={cover} alt={item.nomActivity || item.nom} /> : <Package size={20} />}
                              <span className="option-check">
                                {checked && <Check size={13} />}
                              </span>
                            </div>
                            <div className="option-body">
                              <strong>{item.nomActivity || item.nom}</strong>
                              <span>{item.lieu || detectedCity}</span>
                              <em>{formatPrice(item.prix)}</em>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="planning-empty">Aucune ville détectée.</div>
                    )}
                  </div>
                  {detectedCity && visibleActivites.length === 0 && (
                    <small className="filter-note error">Aucune activité trouvée pour {detectedCity}.</small>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
              </div>

              <div className="form-group">
                <div className="planning-header">
                  <label>Planning journalier</label>
                  <button type="button" className="btn-planning-add" onClick={addPlanningDay}>
                    <Plus size={14} /> Ajouter un jour
                  </button>
                </div>
                {Number(form.duree) > 0 && planningDays.length !== Number(form.duree) && (
                  <div className="planning-warning">
                    Le planning contient {planningDays.length} jour(s) alors que la durée est de {Number(form.duree)} jour(s).
                  </div>
                )}
                <div className="planning-list">
                  {planningDays.length > 0 ? (
                    planningDays.map((day, index) => (
                      <div key={day.day} className="planning-card">
                        <div className="planning-card-header">
                          <input
                            className="planning-title-input"
                            value={day.title}
                            onChange={(e) => updatePlanningDay(index, "title", e.target.value)}
                            placeholder={`Jour ${day.day}`}
                          />
                          <button
                            type="button"
                            className="remove-day-btn"
                            onClick={() => removePlanningDay(index)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="planning-fields">
                          <textarea
                            rows="2"
                            placeholder="Matin"
                            value={day.matin}
                            onChange={(e) => updatePlanningDay(index, "matin", e.target.value)}
                          />
                          <textarea
                            rows="2"
                            placeholder="Après-midi"
                            value={day.apresMidi}
                            onChange={(e) => updatePlanningDay(index, "apresMidi", e.target.value)}
                          />
                          <textarea
                            rows="2"
                            placeholder="Soir"
                            value={day.soir}
                            onChange={(e) => updatePlanningDay(index, "soir", e.target.value)}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="planning-empty">Ajoutez un jour pour construire votre planning.</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Image</label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Aperçu" className="image-preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setForm((prev) => ({ ...prev, imageUrl: "" }));
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={20} />
                      <span>Cliquez pour télécharger une image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Prix total estimé</label>
                <input value={formatPrice(totalCalcule)} readOnly className="total-field" />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
                <button type="submit" className="btn-submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="packs-grid">
        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Chargement des packs...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><Package size={48} /><p>Aucun pack trouvé</p><button className="btn-add" onClick={() => setShowForm(true)}><Plus size={18} /> Créer un pack</button></div>
        ) : (
          filtered.map((pack) => (
            <div className="pack-card" key={pack.id}>
              <div className="card-image">
                {pack.imageUrl ? <img src={pack.imageUrl} alt={pack.nomPack} /> : <div className="image-placeholder"><Package size={32} /></div>}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{pack.nomPack}</h3>
                  <button className="icon-btn delete" onClick={() => handleDelete(pack.id)}><Trash2 size={16} /></button>
                </div>
                {pack.destination && <div className="pack-detail"><MapPin size={14} /> {pack.destination}</div>}
                <div className="pack-detail"><Calendar size={14} /> {pack.duree} jours</div>
                <p className="pack-description">{pack.description}</p>
                <div className="pack-price">{formatPrice(pack.prixTotal)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        /* ----- STYLE ÉLÉGANT POUR L'AJOUT DE PACK ----- */
        .pack-crud {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
        }

        /* En-tête */
        .crud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .crud-header h1 {
          font-size: 1.9rem;
          font-weight: 600;
          background: linear-gradient(135deg, #0f2b3d, #bf5700);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: linear-gradient(105deg, #0f4c75, #bf5700);
          border: none;
          border-radius: 40px;
          font-weight: 500;
          font-size: 0.9rem;
          color: white;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(191,87,0,0.2);
        }
        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(191,87,0,0.3);
        }

        /* Recherche */
        .search-section { margin-bottom: 28px; }
        .search-wrapper {
          position: relative;
          max-width: 360px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #e2e8f0;
          border-radius: 48px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #bf5700;
          box-shadow: 0 0 0 3px rgba(191,87,0,0.1);
        }

        /* Modal overlay & content */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 23, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        .modal-content {
          background: #ffffff;
          border-radius: 32px;
          width: 94%;
          max-width: 860px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1);
          animation: slideUp 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 28px;
          border-bottom: 1px solid #edf2f7;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 600;
          background: linear-gradient(120deg, #0f4c75, #bf5700);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .modal-close {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #475569;
        }
        .modal-close:hover {
          background: #e2e8f0;
          transform: rotate(90deg);
        }

        /* Formulaire */
        .pack-form {
          padding: 28px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4b5563;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.95rem;
          background: #ffffff;
          transition: 0.2s;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #bf5700;
          box-shadow: 0 0 0 3px rgba(191,87,0,0.08);
        }
        .city-hint {
          background: #fef9e6;
          padding: 10px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #b45309;
          margin-bottom: 14px;
          border-left: 4px solid #bf5700;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        .service-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 60px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .service-toggle.active {
          background: #0f4c75;
          border-color: #0f4c75;
          color: white;
        }
        .service-checkbox {
          display: inline-flex;
          width: 18px;
          height: 18px;
          border-radius: 6px;
          background: white;
          align-items: center;
          justify-content: center;
          color: #0f4c75;
        }
        .service-toggle.active .service-checkbox {
          background: white;
        }
        .option-hint {
          font-size: 0.8rem;
          color: #5b6e8c;
          margin-bottom: 14px;
          font-style: italic;
        }
        .option-grid, .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 16px;
        }
        .option-card {
          border: 1px solid #eef2ff;
          border-radius: 24px;
          background: white;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .option-card:hover {
          transform: translateY(-3px);
          border-color: #bf5700;
          box-shadow: 0 16px 28px -12px rgba(191,87,0,0.2);
        }
        .option-card.active {
          border-color: #bf5700;
          box-shadow: 0 0 0 2px rgba(191,87,0,0.2);
        }
        .option-media {
          position: relative;
          height: 130px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .option-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .option-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 26px;
          height: 26px;
          border-radius: 30px;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }
        .option-card.active .option-check {
          background: #bf5700;
          color: white;
        }
        .option-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .option-body strong {
          font-size: 0.9rem;
          color: #1e293b;
        }
        .option-body span {
          font-size: 0.75rem;
          color: #5b6e8c;
        }
        .option-body em {
          font-style: normal;
          font-weight: 700;
          color: #bf5700;
        }

        /* Planning */
        .planning-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .btn-planning-add {
          background: #eef2ff;
          border: none;
          padding: 6px 16px;
          border-radius: 40px;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-planning-add:hover {
          background: #e0e7ff;
        }
        .planning-card {
          background: #fefdfa;
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 14px;
          border: 1px solid #f1efe7;
          transition: 0.2s;
        }
        .planning-card-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }
        .planning-title-input {
          font-weight: 600;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          padding: 6px 14px;
          font-size: 0.85rem;
        }
        .remove-day-btn {
          background: #fee2e2;
          border: none;
          border-radius: 40px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #b91c1c;
        }
        .planning-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .planning-fields textarea {
          border-radius: 18px;
          padding: 10px;
          font-size: 0.85rem;
          resize: vertical;
        }

        /* Upload */
        .image-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 28px;
          padding: 24px;
          text-align: center;
          background: #fefefe;
          transition: 0.2s;
        }
        .image-upload-area:hover {
          border-color: #bf5700;
          background: #fffaf5;
        }
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #5b6e8c;
        }
        .image-preview-container {
          position: relative;
          display: inline-block;
        }
        .image-preview {
          max-width: 200px;
          max-height: 140px;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .remove-image {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }
        .total-field {
          background: #f1f5f9;
          font-weight: 700;
          color: #bf5700;
          font-size: 1.2rem;
        }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #edf2f7;
        }
        .btn-cancel {
          background: #f1f5f9;
          border: none;
          padding: 10px 24px;
          border-radius: 40px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-submit {
          background: linear-gradient(105deg, #0f4c75, #bf5700);
          border: none;
          padding: 10px 28px;
          border-radius: 40px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 4px 12px rgba(191,87,0,0.3);
        }
        .btn-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(191,87,0,0.4);
        }

        /* Responsive */
        @media (max-width: 720px) {
          .form-row { grid-template-columns: 1fr; }
          .planning-fields { grid-template-columns: 1fr; }
          .modal-content { width: 95%; }
          .pack-form { padding: 20px; }
        }
        /* Les styles existants pour les cartes de packs sont conservés */
        .packs-grid { /* garder les styles d'origine */ }
        /* ... */
        
        .pack-crud { padding: 24px; background: #f8f9fa; min-height: 100vh; max-width: 1400px; margin: 0 auto; }
        .crud-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .crud-header h1 { font-size: 1.8rem; color: #1a2a3a; display: flex; align-items: center; gap: 12px; margin: 0; }
        .btn-add { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #0f4c75, #bf5700); color: white; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s; }
        .btn-add:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(191,87,0,0.3); }
        .search-section { margin-bottom: 24px; }
        .search-wrapper { position: relative; max-width: 350px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999; }
        .search-input { width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 0.95rem; background: white; }
        .search-input:focus { outline: none; border-color: #0f4c75; }
        .error-message { background: #fee2e2; color: #dc2626; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,12,16,0.55); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(6px); }
        .modal-content { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border-radius: 22px; width: 92%; max-width: 760px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(12,18,28,0.18); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 2px solid #f0f0f0; }
        .modal-header h2 { margin: 0; font-size: 1.4rem; }
        .modal-close { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; }
        .pack-form { padding: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.78rem; text-transform: uppercase; color: #1f2a37; letter-spacing: 0.08em; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; background: #ffffff; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #0f4c75; box-shadow: 0 0 0 3px rgba(15,76,117,0.12); }
        .city-hint { margin-bottom: 10px; padding: 10px 12px; border-radius: 10px; background: #eef6fb; color: #0f4c75; font-size: 0.88rem; }
        .filter-note { display: block; margin-top: 8px; color: #64748b; font-size: 0.82rem; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
        .option-hint { margin-bottom: 10px; color: #64748b; font-size: 0.82rem; }
        .option-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
        .option-card { width: 100%; border: 1px solid #d7e2ea; border-radius: 18px; background: #fff; cursor: pointer; overflow: hidden; text-align: left; padding: 0; transition: 0.22s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.04); }
        .option-card:hover { transform: translateY(-2px); border-color: #0f4c75; box-shadow: 0 14px 30px rgba(15,76,117,0.12); }
        .option-card.active { border-color: #0f4c75; box-shadow: 0 0 0 3px rgba(15,76,117,0.10), 0 14px 30px rgba(15,76,117,0.12); }
        .option-media { position: relative; height: 120px; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); display: flex; align-items: center; justify-content: center; color: #94a3b8; overflow: hidden; }
        .option-media img { width: 100%; height: 100%; object-fit: cover; }
        .option-check { position: absolute; top: 10px; right: 10px; width: 26px; height: 26px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.92); color: #0f4c75; box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
        .option-card.active .option-check { background: #0f4c75; color: #fff; }
        .option-body { display: grid; gap: 4px; padding: 14px 14px 16px; }
        .option-body strong { font-size: 0.96rem; color: #172033; }
        .option-body span { font-size: 0.82rem; color: #64748b; }
        .option-body em { font-style: normal; font-weight: 700; color: #bf5700; }
        .activity-grid { display: grid; gap: 14px; }
        .image-upload-area { border: 2px dashed #d6e2ee; border-radius: 14px; padding: 20px; text-align: center; background: #f8fafc; transition: 0.2s; }
        .image-upload-area:hover { border-color: #0f4c75; background: #f1f5f9; }
        .upload-label { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #666; }
        .image-preview-container { position: relative; display: inline-block; }
        .image-preview { max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover; }
        .remove-image { position: absolute; top: -8px; right: -8px; background: #dc2626; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .total-field { background: #eef2f3; font-weight: bold; color: #bf5700; }
        .planning-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .btn-planning-add { display: inline-flex; align-items: center; gap: 6px; border: none; background: #eef6fb; color: #0f4c75; padding: 8px 12px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .planning-warning { margin-bottom: 10px; padding: 10px 12px; border-radius: 10px; background: #fff7ed; color: #c2410c; border: 1px solid #fdba74; font-size: 0.85rem; }
        .planning-list { display: grid; gap: 12px; }
        .planning-card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; background: #fff; }
        .planning-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .planning-title-input { flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; font-weight: 600; }
        .remove-day-btn { width: 34px; height: 34px; border: none; border-radius: 10px; background: #fee2e2; color: #dc2626; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .planning-fields { display: grid; gap: 10px; }
        .planning-fields textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; resize: vertical; font-family: inherit; }
        .planning-empty { padding: 14px 16px; border-radius: 14px; background: #f8fafc; color: #64748b; border: 1px dashed #d7e2ea; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 2px solid #f0f0f0; }
        .btn-cancel { padding: 10px 20px; background: #f1f5f9; border: none; border-radius: 10px; cursor: pointer; color: #334155; font-weight: 600; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #0f4c75, #bf5700); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 10px 24px rgba(191,87,0,0.25); }
        .packs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
        .pack-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: 0.3s; }
        .pack-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        .card-image { height: 180px; background: #f5f5f5; overflow: hidden; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .pack-card:hover .card-image img { transform: scale(1.05); }
        .image-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; }
        .card-content { padding: 20px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 12px; }
        .card-header h3 { margin: 0; font-size: 1.2rem; }
        .pack-detail { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #666; margin: 6px 0; }
        .pack-description { color: #777; font-size: 0.85rem; margin: 10px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .pack-price { font-size: 1.3rem; font-weight: 700; color: #bf5700; margin-top: 12px; }
        .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .icon-btn.delete:hover { background: #dc2626; color: white; }
        .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #999; grid-column: 1/-1; }
        .spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #0f4c75; border-right-color: #bf5700; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .pack-crud { padding: 16px; } .form-row { grid-template-columns: 1fr; } .packs-grid { grid-template-columns: 1fr; } }
     
      `}</style>
    </div>
  );
};

export default Pack;
