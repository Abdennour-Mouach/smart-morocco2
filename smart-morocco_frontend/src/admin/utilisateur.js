import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Edit, Trash2, X, Search, User, Mail, Phone, Shield } from "lucide-react";

const Utilisateur = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id_utilisateur: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    role: "ROLE_USER",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/utilisateurs/roleUser");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les utilisateurs.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ id_utilisateur: "", nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", role: "ROLE_USER" });
    setShowForm(false);
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, id_utilisateur: form.id_utilisateur ? Number(form.id_utilisateur) : undefined };
    if (!payload.mot_de_passe) delete payload.mot_de_passe;
    try {
      if (form.id_utilisateur) await api.put(`/api/utilisateurs/${form.id_utilisateur}`, payload);
      else await api.post("/api/utilisateurs", payload);
      resetForm();
      load();
    } catch (e2) {
      console.error(e2);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/api/utilisateurs/${id}`);
      load();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = items.filter(i => (i.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.nom + " " + i.prenom).toLowerCase().includes(search.toLowerCase()));

  const getRoleIcon = (role) => role === "ROLE_ADMIN" ? <Shield size={14} /> : <User size={14} />;

  return (
    <div className="user-crud">
      <div className="crud-header">
        <h1><span className="header-icon">👥</span> Gestion des utilisateurs</h1>
      </div>

      <div className="search-section">
        <div className="search-wrapper"><Search size={18} className="search-icon" /><input className="search-input" placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>{form.id_utilisateur ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2><button className="modal-close" onClick={() => resetForm()}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row"><div className="form-group"><label>Nom</label><input name="nom" value={form.nom} onChange={handleChange} required /></div><div className="form-group"><label>Prénom</label><input name="prenom" value={form.prenom} onChange={handleChange} /></div></div>
              <div className="form-row"><div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div><div className="form-group"><label>Téléphone</label><input name="telephone" value={form.telephone} onChange={handleChange} /></div></div>
              <div className="form-row"><div className="form-group"><label>Mot de passe {form.id_utilisateur && "(laisser vide pour inchangé)"}</label><input type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} /></div><div className="form-group"><label>Rôle</label><select name="role" value={form.role} onChange={handleChange}><option value="ROLE_USER">Utilisateur</option><option value="ROLE_ADMIN">Administrateur</option></select></div></div>
              <div className="form-actions"><button type="button" className="btn-cancel" onClick={() => resetForm()}>Annuler</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Grille cartes */}
      <div className="users-grid">
        {loading ? <div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div>
        : filtered.length === 0 ? <div className="empty-state"><User size={48} /><p>Aucun utilisateur</p><button className="btn-add" onClick={() => setShowForm(true)}><Plus size={18} /> Ajouter</button></div>
        : filtered.map(user => (
          <div className="user-card" key={user.id_utilisateur || user.id}>
            <div className="card-avatar"><User size={32} /></div>
            <div className="card-info">
              <h3>{user.prenom} {user.nom}</h3>
              <div className="user-detail"><Mail size={14} /> {user.email}</div>
              <div className="user-detail"><Phone size={14} /> {user.telephone || "—"}</div>
              <div className="user-role">{getRoleIcon(user.role)} {user.role === "ROLE_ADMIN" ? "Admin" : "Utilisateur"}</div>
            </div>
            <div className="card-actions">
              <button className="icon-btn delete" onClick={() => handleDelete(user.id_utilisateur || user.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .user-crud { padding: 24px; background: #f8f9fa; min-height: 100vh; max-width: 1200px; margin: 0 auto; }
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
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 20px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 2px solid #f0f0f0; }
        .modal-close { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; }
        .user-form { padding: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.85rem; text-transform: uppercase; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 2px solid #f0f0f0; }
        .btn-cancel { padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 10px; cursor: pointer; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #0f4c75, #bf5700); color: white; border: none; border-radius: 10px; cursor: pointer; }
        .users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
        .user-card { background: white; border-radius: 20px; padding: 20px; display: flex; gap: 16px; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: 0.3s; position: relative; }
        .user-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        .card-avatar { width: 60px; height: 60px; background: linear-gradient(135deg, #0f4c75, #bf5700); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
        .card-info { flex: 1; }
        .card-info h3 { margin: 0 0 6px 0; font-size: 1.1rem; }
        .user-detail { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #666; margin: 4px 0; }
        .user-role { display: inline-flex; align-items: center; gap: 4px; background: #e3f2fd; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; margin-top: 8px; }
        .card-actions { display: flex; flex-direction: column; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .icon-btn.edit { background: #e3f2fd; color: #0f4c75; }
        .icon-btn.edit:hover { background: #0f4c75; color: white; }
        .icon-btn.delete { background: #fee2e2; color: #dc2626; }
        .icon-btn.delete:hover { background: #dc2626; color: white; }
        .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #999; grid-column: 1/-1; }
        .spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #0f4c75; border-right-color: #bf5700; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .user-crud { padding: 16px; } .form-row { grid-template-columns: 1fr; } .user-card { flex-wrap: wrap; } }
      `}</style>
    </div>
  );
};

export default Utilisateur;