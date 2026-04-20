import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Upload, Image as ImageIcon, Plus, Edit, Trash2, X, Search } from "lucide-react";
import "./AdminCrud.css";

const Activite = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    id: "",
    nomActivity: "",
    description: "",
    lieu: "",
    duree: "",
    prix: "",
    imageUrl: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/activites");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Erreur lors du chargement des activites:", e);
      setError("Impossible de charger les activites. Vérifiez que le serveur est en cours d'exécution.");
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
      nomActivity: "",
      description: "",
      lieu: "",
      duree: "",
      prix: "",
      imageUrl: "",
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
      nomActivity: form.nomActivity,
      description: form.description,
      lieu: form.lieu,
      duree: form.duree,
      prix: form.prix ? Number(form.prix) : 0,
      imageUrl: imageUrl,
    };
    try {
      await api.post("/api/activites", payload);
      resetForm();
      load();
    } catch (e2) {
      console.error(e2);
      const backendMessage =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        (typeof e2?.response?.data === "string" ? e2.response.data : "");
      setError(backendMessage || "Erreur lors de l'enregistrement.");
    }
  };

  const startEdit = (item) => {
    setForm({
      id: item.id || "",
      nomActivity: item.nomActivity || item.nom || "",
      description: item.description || "",
      lieu: item.lieu || "",
      duree: item.duree || "",
      prix: item.prix || "",
      imageUrl: item.imageUrl || "",
    });
    setImagePreview(item.imageUrl || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette activité ?")) return;
    try {
      await api.delete(`/api/activites/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = Array.isArray(items) ? items.filter((i) => {
    const name = (i.nomActivity || i.nom || "").toLowerCase();
    return name.includes(search.toLowerCase());
  }) : [];

  const formatPrice = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(prix);
  };

  return (
    <div className="admin-crud activite-crud">
      <div className="crud-header">
        <h1>
          <span className="header-icon">🎯</span>
          Gestion des activités
        </h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Nouvelle activité
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

      {/* Formulaire modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{form.id ? "Modifier l'activité" : "Ajouter une activité"}</h2>
              <button className="modal-close" onClick={() => resetForm()}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="activite-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom de l'activité *</label>
                  <input 
                    name="nomActivity" 
                    value={form.nomActivity} 
                    onChange={handleChange} 
                    placeholder="Ex: Excursion dans le désert"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input 
                    name="lieu" 
                    value={form.lieu} 
                    onChange={handleChange} 
                    placeholder="Ex: Merzouga"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Durée</label>
                  <input 
                    name="duree" 
                    value={form.duree} 
                    onChange={handleChange} 
                    placeholder="Ex: 2 jours / 1 nuit"
                  />
                </div>
                <div className="form-group">
                  <label>Prix (MAD)</label>
                  <input 
                    name="prix" 
                    type="number" 
                    value={form.prix} 
                    onChange={handleChange} 
                    placeholder="Ex: 1200"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="3"
                  placeholder="Décrivez l'activité..."
                />
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

      {/* Liste des activités */}
      <div className="activities-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des activités...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} />
            <p>Aucune activité trouvée</p>
            <button className="btn-add" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Ajouter votre première activité
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div className="activity-card" key={item.id}>
              <div className="activity-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.nomActivity} />
                ) : (
                  <div className="image-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h3>{item.nomActivity || item.nom}</h3>
                  <div className="activity-actions">
                    <button className="icon-btn edit" onClick={() => startEdit(item)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="activity-description">{item.description}</p>
                <div className="activity-details">
                  <div className="detail">
                    <span className="detail-label">📍 Lieu</span>
                    <span className="detail-value">{item.lieu || "—"}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">⏱️ Durée</span>
                    <span className="detail-value">{item.duree || "—"}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">💰 Prix</span>
                    <span className="detail-value price">{formatPrice(item.prix)}</span>
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

export default Activite;
