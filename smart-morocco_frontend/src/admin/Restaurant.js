import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Upload, Plus, Edit, Trash2, X, Search, Utensils, DollarSign, Coffee, MapPin } from "lucide-react";

const Restaurant = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    id: "",
    nomRestauration: "",
    typeCuisine: "",
    repasInclus: "",
    lieu: "",
    prix: "",
    description: "",
    imageurl: "",
    packId: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/restaurations");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Erreur lors du chargement des restaurations:", e);
      setError("Impossible de charger les restaurants. Vérifiez que le serveur est en cours d'exécution.");
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
      nomRestauration: "",
      typeCuisine: "",
      repasInclus: "",
      lieu: "",
      prix: "",
      description: "",
      imageurl: "",
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

    let imageUrl = form.imageurl;
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
      nomRestauration: form.nomRestauration,
      typeCuisine: form.typeCuisine,
      repasInclus: form.repasInclus,
      lieu: form.lieu,
      prix: form.prix ? Number(form.prix) : 0,
      description: form.description,
      imageurl: imageUrl,
      pack: form.packId ? { id: Number(form.packId) } : null,
    };
    try {
      await api.post("/api/restaurations", payload);
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
      nomRestauration: item.nomRestauration || "",
      typeCuisine: item.typeCuisine || "",
      repasInclus: item.repasInclus || "",
      lieu: item.lieu || "",
      prix: item.prix || "",
      description: item.description || "",
      imageurl: item.imageurl || "",
      packId: item.pack?.id || "",
    });
    setImagePreview(item.imageurl || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce restaurant ?")) return;
    try {
      await api.delete(`/api/restaurations/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = Array.isArray(items) ? items.filter((i) =>
    (i.nomRestauration || "").toLowerCase().includes(search.toLowerCase())
  ) : [];

  const formatPrice = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(prix);
  };

  return (
    <div className="restaurant-crud">
      <div className="crud-header">
        <h1>
          <span className="header-icon">🍽️</span>
          Gestion des restaurants
        </h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Nouveau restaurant
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
              <h2>{form.id ? "Modifier le restaurant" : "Ajouter un restaurant"}</h2>
              <button className="modal-close" onClick={() => resetForm()}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="restaurant-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input name="nomRestauration" value={form.nomRestauration} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Type de cuisine</label>
                  <input name="typeCuisine" value={form.typeCuisine} onChange={handleChange} placeholder="Ex: Marocaine, Italienne" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Repas inclus</label>
                  <input name="repasInclus" value={form.repasInclus} onChange={handleChange} placeholder="Ex: Petit-déjeuner" />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input name="lieu" value={form.lieu} onChange={handleChange} placeholder="Ex: Fes, Marrakech" />
                </div>
                <div className="form-group">
                  <label>Prix (MAD)</label>
                  <input name="prix" type="number" value={form.prix} onChange={handleChange} />
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
                          setForm({ ...form, imageurl: "" });
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={20} />
                      <span>Cliquez pour télécharger un fichier</span>
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

      {/* Liste des restaurants en cartes */}
      <div className="restaurants-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Utensils size={48} />
            <p>Aucun restaurant trouvé</p>
            <button className="btn-add" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Ajouter votre premier restaurant
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div className="restaurant-card" key={item.id}>
              <div className="card-image">
                {item.imageurl ? (
                  <img src={item.imageurl} alt={item.nomRestauration} />
                ) : (
                  <div className="image-placeholder">
                    <Utensils size={32} />
                  </div>
                )}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{item.nomRestauration}</h3>
                  <div className="card-actions">
                    <button className="icon-btn edit" onClick={() => startEdit(item)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {item.typeCuisine && (
                  <p className="restaurant-cuisine">
                    <Utensils size={14} />
                    {item.typeCuisine}
                  </p>
                )}
                {item.repasInclus && (
                  <p className="restaurant-meal">
                    <Coffee size={14} />
                    {item.repasInclus}
                  </p>
                )}
                {item.lieu && (
                  <p className="restaurant-cuisine">
                    <MapPin size={14} />
                    {item.lieu}
                  </p>
                )}
                <p className="restaurant-description">{item.description}</p>
                <div className="restaurant-details">
                  <div className="detail">
                    <DollarSign size={14} />
                    <span className="price">{formatPrice(item.prix)}</span>
                  </div>
                  {item.pack && (
                    <div className="detail">
                      <span className="pack-badge">Pack #{item.pack.id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Styles intégrés */}
      <style>{`
        .restaurant-crud {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .crud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .crud-header h1 {
          font-size: 1.8rem;
          color: #1a2a3a;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
        }

        .header-icon {
          font-size: 2rem;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(191, 87, 0, 0.3);
        }

        /* Search */
        .search-section {
          margin-bottom: 24px;
        }

        .search-wrapper {
          position: relative;
          max-width: 350px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #0f4c75;
          box-shadow: 0 0 0 3px rgba(15, 76, 117, 0.1);
        }

        /* Error */
        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 12, 16, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(6px);
        }

        .modal-content {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 22px;
          width: 92%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideIn 0.35s ease;
          box-shadow: 0 24px 60px rgba(12, 18, 28, 0.18);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.4rem;
          color: #1a2a3a;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        /* Formulaire */
        .restaurant-form {
          padding: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1f2a37;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          font-family: inherit;
          background: #ffffff;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0f4c75;
          box-shadow: 0 0 0 3px rgba(15, 76, 117, 0.12);
        }

        /* Upload image */
        .image-upload-area {
          border: 2px dashed #d6e2ee;
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s ease;
          background: #f8fafc;
        }

        .image-upload-area:hover {
          border-color: #0f4c75;
          background: #f1f5f9;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .upload-label:hover {
          color: #0f4c75;
        }

        .image-preview-container {
          position: relative;
          display: inline-block;
        }

        .image-preview {
          max-width: 200px;
          max-height: 150px;
          border-radius: 8px;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .remove-image:hover {
          background: #b91c1c;
          transform: scale(1.1);
        }

        /* Actions formulaire */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 2px solid #f0f0f0;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f1f5f9;
          color: #334155;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #e0e0e0;
        }

        .btn-submit {
          padding: 10px 24px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 10px 24px rgba(191, 87, 0, 0.25);
        }

        .btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(191, 87, 0, 0.3);
        }

        /* Grille des cartes */
        .restaurants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .restaurant-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .restaurant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .restaurant-card:hover .card-image img {
          transform: scale(1.05);
        }

        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
          color: #ccc;
        }

        .card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #1a2a3a;
          font-weight: 600;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .icon-btn.edit {
          background: #e3f2fd;
          color: #0f4c75;
        }

        .icon-btn.edit:hover {
          background: #0f4c75;
          color: white;
        }

        .icon-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .icon-btn.delete:hover {
          background: #dc2626;
          color: white;
        }

        .restaurant-cuisine,
        .restaurant-meal {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          margin: 4px 0;
          color: #0f4c75;
        }

        .restaurant-meal {
          color: #bf5700;
        }

        .restaurant-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .restaurant-details {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }

        .restaurant-details .detail {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .restaurant-details .price {
          color: #bf5700;
          font-weight: 700;
          font-size: 1rem;
        }

        .pack-badge {
          background: #e3f2fd;
          color: #0f4c75;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Loading & Empty states */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #999;
          grid-column: 1 / -1;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f0f0f0;
          border-top-color: #0f4c75;
          border-right-color: #bf5700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          text-align: center;
          color: #999;
          background: white;
          border-radius: 16px;
          grid-column: 1 / -1;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          margin-bottom: 20px;
          font-size: 1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .restaurant-crud {
            padding: 16px;
          }

          .crud-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .restaurants-grid {
            grid-template-columns: 1fr;
          }

          .search-wrapper {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Restaurant;
