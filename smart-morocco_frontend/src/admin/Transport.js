import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Edit, Trash2, X, Search, Bus, Calendar, MapPin, DollarSign } from "lucide-react";

const Transport = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: "",
    typeTransport: "",
    villeDepart: "",
    villeArrivee: "",
    dateDepart: "",
    heure: "",
    prix: "",
    description: "",
    packId: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/transports");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Erreur lors du chargement des transports:", e);
      setError("Impossible de charger les transports.");
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
      typeTransport: "",
      villeDepart: "",
      villeArrivee: "",
      dateDepart: "",
      heure: "",
      prix: "",
      description: "",
      packId: "",
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      id: form.id ? Number(form.id) : undefined,
      typeTransport: form.typeTransport,
      villeDepart: form.villeDepart,
      villeArrivee: form.villeArrivee,
      dateDepart: form.dateDepart,
      heure: form.heure,
      prix: form.prix ? Number(form.prix) : 0,
      description: form.description,
      pack: form.packId ? { id: Number(form.packId) } : null,
    };
    try {
      await api.post("/api/transports", payload);
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
      typeTransport: item.typeTransport || "",
      villeDepart: item.villeDepart || "",
      villeArrivee: item.villeArrivee || "",
      dateDepart: item.dateDepart || "",
      heure: item.heure || "",
      prix: item.prix || "",
      description: item.description || "",
      packId: item.pack?.id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce transport ?")) return;
    try {
      await api.delete(`/api/transports/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = items.filter((i) =>
    (i.villeDepart || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.villeArrivee || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.typeTransport || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (prix) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(prix);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="transport-crud">
      <div className="crud-header">
        <h1><span className="header-icon">🚌</span> Gestion des transports</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}><Plus size={18} /> Nouveau transport</button>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Rechercher par ville ou type..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Modal Formulaire */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{form.id ? "Modifier le transport" : "Ajouter un transport"}</h2>
              <button className="modal-close" onClick={() => resetForm()}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="transport-form">
              <div className="form-row">
                <div className="form-group"><label>Type *</label><input name="typeTransport" value={form.typeTransport} onChange={handleChange} required /></div>
                <div className="form-group"><label>Ville départ</label><input name="villeDepart" value={form.villeDepart} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Ville arrivée</label><input name="villeArrivee" value={form.villeArrivee} onChange={handleChange} /></div>
                <div className="form-group"><label>Date départ</label><input type="date" name="dateDepart" value={form.dateDepart} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Heure</label><input type="time" name="heure" value={form.heure} onChange={handleChange} /></div>
                <div className="form-group"><label>Prix (MAD)</label><input type="number" name="prix" value={form.prix} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>Pack ID</label><input type="number" name="packId" value={form.packId} onChange={handleChange} /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows="2" /></div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => resetForm()}>Annuler</button>
                <button type="submit" className="btn-submit">{form.id ? "Modifier" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grille des cartes */}
      <div className="transports-grid">
        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><Bus size={48} /><p>Aucun transport trouvé</p><button className="btn-add" onClick={() => setShowForm(true)}><Plus size={18} /> Ajouter</button></div>
        ) : (
          filtered.map((item) => (
            <div className="transport-card" key={item.id}>
              <div className="card-header">
                <h3><Bus size={18} /> {item.typeTransport}</h3>
                <div className="card-actions">
                  <button className="icon-btn edit" onClick={() => startEdit(item)}><Edit size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="card-body">
                <div className="route"><MapPin size={14} /> {item.villeDepart} → {item.villeArrivee}</div>
                <div className="datetime"><Calendar size={14} /> {formatDate(item.dateDepart)} {item.heure && `à ${item.heure}`}</div>
                <div className="price"><DollarSign size={14} /> {formatPrice(item.prix)}</div>
                {item.description && <p className="description">{item.description}</p>}
                {item.pack && <span className="pack-badge">Pack #{item.pack.id}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .transport-crud { padding: 24px; background: #f8f9fa; min-height: 100vh; max-width: 1400px; margin: 0 auto; }
        .crud-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .crud-header h1 { font-size: 1.8rem; color: #1a2a3a; display: flex; align-items: center; gap: 12px; margin: 0; }
        .btn-add { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #0f4c75, #bf5700); color: white; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s; }
        .btn-add:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(191,87,0,0.3); }
        .search-section { margin-bottom: 24px; }
        .search-wrapper { position: relative; max-width: 350px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999; }
        .search-input { width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 0.95rem; background: white; }
        .search-input:focus { outline: none; border-color: #0f4c75; box-shadow: 0 0 0 3px rgba(15,76,117,0.1); }
        .error-message { background: #fee2e2; color: #dc2626; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; }
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 20px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 2px solid #f0f0f0; }
        .modal-header h2 { margin:0; font-size:1.4rem; }
        .modal-close { background: none; border: none; cursor: pointer; color: #999; padding: 8px; border-radius: 8px; }
        .modal-close:hover { background: #f0f0f0; }
        .transport-form { padding: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.85rem; text-transform: uppercase; color: #333; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 0.95rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #0f4c75; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 2px solid #f0f0f0; }
        .btn-cancel { padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 10px; cursor: pointer; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #0f4c75, #bf5700); color: white; border: none; border-radius: 10px; cursor: pointer; }
        .transports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
        .transport-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: 0.3s; }
        .transport-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        .card-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 8px 20px; }
        .card-header h3 { margin:0; display: flex; align-items: center; gap: 8px; font-size:1.2rem; }
        .card-actions { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .icon-btn.edit { background: #e3f2fd; color: #0f4c75; }
        .icon-btn.edit:hover { background: #0f4c75; color: white; }
        .icon-btn.delete { background: #fee2e2; color: #dc2626; }
        .icon-btn.delete:hover { background: #dc2626; color: white; }
        .card-body { padding: 0 20px 20px 20px; display: flex; flex-direction: column; gap: 8px; }
        .route, .datetime, .price { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #555; }
        .price { color: #bf5700; font-weight: 700; }
        .description { color: #666; font-size: 0.85rem; margin-top: 4px; }
        .pack-badge { background: #e3f2fd; color: #0f4c75; padding: 4px 8px; border-radius: 20px; font-size: 0.75rem; align-self: flex-start; }
        .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #999; grid-column: 1/-1; }
        .spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #0f4c75; border-right-color: #bf5700; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .transport-crud { padding: 16px; } .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Transport;
