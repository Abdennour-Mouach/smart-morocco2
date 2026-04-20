import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Upload, Image as ImageIcon, Plus, Edit, Trash2, X, Search, Star, MapPin, Users, DollarSign } from "lucide-react";
import "./Hebergement.css";

const Hebergement = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    id: "",
    type: "",
    nomHibergement: "",
    adresse: "",
    lieu: "",
    etoiles: "",
    capacite: "",
    prixParNuit: "",
    description: "",
    imageUrl: "",
    packId: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/hebergements");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Erreur lors du chargement des hebergements:", e);
      setError("Impossible de charger les hébergements. Vérifiez que le serveur est en cours d'exécution.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      id: "",
      type: "",
      nomHibergement: "",
      adresse: "",
      lieu: "",
      etoiles: "",
      capacite: "",
      prixParNuit: "",
      description: "",
      imageUrl: "",
      packId: "",
    });
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.data || (!res.data.url && !res.data.filePath)) {
        const preview = typeof res.data === "string" ? res.data.slice(0, 120) : "";
        setError(
          `Upload image échoué : réponse invalide (URL manquante).` +
            (preview ? ` Réponse: ${preview}...` : "")
        );
        return null;
      }
      return res.data.url || res.data.filePath;
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.error("Erreur lors de l'upload:", e);
      setError(
        `Upload image échoué${status ? ` (${status})` : ""} : ` +
          (data?.message || (typeof data === "string" ? data : "Erreur réseau ou serveur"))
      );
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let imageUrl = form.imageUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        setError("Upload image échoué : aucune URL reçue.");
        return;
      }
    }
    if (!imageUrl) {
      setError("Image non envoyée : imageUrl est vide.");
      return;
    }

    const payload = {
      id: form.id ? Number(form.id) : undefined,
      type: form.type,
      nomHibergement: form.nomHibergement,
      adresse: form.adresse,
      lieu: form.lieu,
      etoiles: form.etoiles ? Number(form.etoiles) : 0,
      capacite: form.capacite ? Number(form.capacite) : 0,
      prixParNuit: form.prixParNuit ? Number(form.prixParNuit) : 0,
      description: form.description,
      imageUrl: imageUrl,
      pack: form.packId ? { id: Number(form.packId) } : null,
    };
    try {
      await api.post("/api/hebergements", payload);
      resetForm();
      load();
    } catch (e2) {
      console.error(e2);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  const startEdit = (item) => {
    setForm({
      id: item.id || "",
      type: item.type || "",
      nomHibergement: item.nomHibergement || "",
      adresse: item.adresse || "",
      lieu: item.lieu || "",
      etoiles: item.etoiles || "",
      capacite: item.capacite || "",
      prixParNuit: item.prixParNuit || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      packId: item.pack?.id || "",
    });
    setImagePreview(item.imageUrl || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet hébergement ?")) return;
    try {
      await api.delete(`/api/hebergements/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = Array.isArray(items) ? items.filter((i) =>
    (i.nomHibergement || "").toLowerCase().includes(search.toLowerCase())
  ) : [];

  const formatPrice = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(prix);
  };

  const renderStars = (etoiles) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= etoiles ? 'star-filled' : 'star-empty'}
            fill={star <= etoiles ? '#ffb84d' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="admin-crud hebergement-crud">
      <div className="crud-header">
        <h1>
          <span className="header-icon">🏨</span>
          Gestion des hébergements
        </h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Nouvel hébergement
        </button>
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

      {/* Modal Formulaire */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{form.id ? "Modifier l'hébergement" : "Ajouter un hébergement"}</h2>
              <button className="modal-close" onClick={() => resetForm()}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="hebergement-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input name="nomHibergement" value={form.nomHibergement} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input name="type" value={form.type} onChange={handleChange} placeholder="Ex: Hôtel, Riad, Appartement" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adresse</label>
                  <input name="adresse" value={form.adresse} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input name="lieu" value={form.lieu} onChange={handleChange} placeholder="Ex: Fes, Marrakech" />
                </div>
                <div className="form-group">
                  <label>Étoiles</label>
                  <input name="etoiles" type="number" min="0" max="5" step="0.5" value={form.etoiles} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacité (personnes)</label>
                  <input name="capacite" type="number" value={form.capacite} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Prix par nuit (MAD)</label>
                  <input name="prixParNuit" type="number" value={form.prixParNuit} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Pack ID (optionnel)</label>
                <input name="packId" type="number" value={form.packId} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
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
                          setForm({ ...form, imageUrl: "" });
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={20} />
                      <span>Cliquez pour télécharger une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => resetForm()}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {form.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des hébergements en cartes */}
      <div className="hebergements-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des hébergements...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} />
            <p>Aucun hébergement trouvé</p>
            <button className="btn-add" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Ajouter votre premier hébergement
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div className="hebergement-card" key={item.id}>
              <div className="card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.nomHibergement} />
                ) : (
                  <div className="image-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{item.nomHibergement}</h3>
                  <div className="card-actions">
                    <button className="icon-btn edit" onClick={() => startEdit(item)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {item.type && <p className="hebergement-type">{item.type}</p>}
                <div className="hebergement-stars">
                  {renderStars(item.etoiles)}
                  <span>({item.etoiles})</span>
                </div>
                <p className="hebergement-description">{item.description}</p>
                <div className="hebergement-details">
                  <div className="detail">
                    <MapPin size={14} />
                    <span>{item.lieu || item.adresse || "Lieu non spécifié"}</span>
                  </div>
                  <div className="detail">
                    <Users size={14} />
                    <span>{item.capacite} personnes</span>
                  </div>
                  <div className="detail">
                    <DollarSign size={14} />
                    <span className="price">{formatPrice(item.prixParNuit)} / nuit</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Hebergement;
