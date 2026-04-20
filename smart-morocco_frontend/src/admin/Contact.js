import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
  Mail,
  User,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
  Search,
  Filter,
  Star,
  Eye,
  Inbox,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

const ContactAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const itemsPerPage = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/contacts");
      const messages = (Array.isArray(res.data) ? res.data : []).map((msg) => ({
        ...msg,
        lu: msg.lu || false,
        important: msg.important || false,
      }));
      setItems(messages);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les messages.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.prenom?.toLowerCase().includes(term) ||
          msg.nom?.toLowerCase().includes(term) ||
          msg.email?.toLowerCase().includes(term) ||
          msg.message?.toLowerCase().includes(term)
      );
    }
    if (statusFilter === "nonLu") {
      filtered = filtered.filter((msg) => !msg.lu);
    } else if (statusFilter === "lu") {
      filtered = filtered.filter((msg) => msg.lu);
    } else if (statusFilter === "important") {
      filtered = filtered.filter((msg) => msg.important);
    }
    return filtered;
  }, [items, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await api.delete(`/api/contacts/${id}`);
      await load();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression.");
    }
  };

  const openDetails = (msg) => {
    setSelectedMessage(msg);
    if (!msg.lu) {
      api.patch(`/api/contacts/${msg.id}`, { lu: true }).catch(console.error);
      setItems((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, lu: true } : m))
      );
    }
  };

  const closeDetails = () => {
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleReply = async () => {
    if (!replyText.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      await api.post(`/api/contacts/${selectedMessage.id}/reply`, {
        reply: replyText,
      });
      alert("Réponse envoyée avec succès !");
      setReplyText("");
      closeDetails();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la réponse.");
    } finally {
      setSendingReply(false);
    }
  };

  const toggleImportant = async (id, e) => {
    e.stopPropagation();
    const msg = items.find((m) => m.id === id);
    if (!msg) return;
    const newImportant = !msg.important;
    try {
      await api.patch(`/api/contacts/${id}`, { important: newImportant });
      setItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, important: newImportant } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ""}${nom?.charAt(0) || ""}`.toUpperCase();
  };

  const stats = {
    total: items.length,
    nonLu: items.filter((m) => !m.lu).length,
    importants: items.filter((m) => m.important).length,
  };

  return (
    <div className="message-page">
      <div className="message-container">
        {/* En-tête */}
        <div className="message-header">
          <div className="header-left">
            <div className="header-icon">
              <Mail />
            </div>
            <div className="header-title">
              <h1>Messages reçus</h1>
              <p>
                Gérez vos demandes de contact
                <span className="header-badge">
                  <Clock size={14} /> Dernière mise à jour :{" "}
                  {new Date().toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>
          <button className="filter-btn" onClick={load}>
            <RefreshCw size={18} /> Actualiser
          </button>
        </div>

        {/* Cartes statistiques */}
        <div className="message-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Mail />
            </div>
            <div className="stat-content">
              <h3>Total messages</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <AlertCircle />
            </div>
            <div className="stat-content">
              <h3>Non lus</h3>
              <p>{stats.nonLu}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Star />
            </div>
            <div className="stat-content">
              <h3>Importants</h3>
              <p>{stats.importants}</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="message-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
            >
              <Inbox size={16} /> Tous
            </button>
            <button
              className={`filter-btn ${statusFilter === "nonLu" ? "active" : ""}`}
              onClick={() => {
                setStatusFilter("nonLu");
                setCurrentPage(1);
              }}
            >
              <AlertCircle size={16} /> Non lus
            </button>
            <button
              className={`filter-btn ${statusFilter === "important" ? "active" : ""}`}
              onClick={() => {
                setStatusFilter("important");
                setCurrentPage(1);
              }}
            >
              <Star size={16} /> Importants
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="message-table-wrapper">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <Mail size={80} />
              <h3>Aucun message trouvé</h3>
              <p>Essayez de modifier vos filtres ou revenez plus tard.</p>
              <button className="filter-btn" onClick={load}>
                <RefreshCw size={16} /> Recharger
              </button>
            </div>
          ) : (
            <table className="message-table">
              <thead>
                <tr>
                  <th>Expéditeur</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((msg, idx) => (
                  <tr
                    key={msg.id}
                    onClick={() => openDetails(msg)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.8rem" }}>
                          {getInitials(msg.prenom, msg.nom)}
                        </div>
                        <strong>
                          {msg.prenom} {msg.nom}
                        </strong>
                      </div>
                    </td>
                    <td>{msg.email}</td>
                    <td>
                      <div className="message-preview">
                        {msg.message.length > 60
                          ? msg.message.slice(0, 60) + "..."
                          : msg.message}
                      </div>
                    </td>
                    
                    <td>
                      <div
                        className={`status-badge ${!msg.lu ? "non-lu" : "lu"} ${
                          msg.important ? "important" : ""
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!msg.lu ? (
                          <>
                            <AlertCircle size={12} /> Non lu
                          </>
                        ) : msg.important ? (
                          <>
                            <Star size={12} /> Important
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} /> Lu
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(msg);
                          }}
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={(e) => handleDelete(msg.id, e)}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredItems.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Modal */}
        {selectedMessage && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <Mail size={18} style={{ marginRight: "0.5rem" }} />
                  Message de {selectedMessage.prenom} {selectedMessage.nom}
                </h2>
                <button className="modal-close" onClick={closeDetails}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="message-detail-item">
                  <div className="message-detail-label">
                    <User size={14} /> Expéditeur
                  </div>
                  <div className="message-detail-value">
                    {selectedMessage.prenom} {selectedMessage.nom}
                  </div>
                </div>
                <div className="message-detail-item">
                  <div className="message-detail-label">
                    <Mail size={14} /> Email
                  </div>
                  <div className="message-detail-value">
                    <a href={`mailto:${selectedMessage.email}`}>
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <div className="message-detail-item">
                  <div className="message-detail-label">
                    <MessageSquare size={14} /> Message
                  </div>
                  <div className="message-detail-value message-content">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="message-detail-item">
                  <div className="message-detail-label">
                    <Clock size={14} /> Reçu le
                  </div>
                  <div className="message-detail-value">
                    {new Date(selectedMessage.createdAt).toLocaleString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="reply-section">
                  <textarea
                    className="reply-textarea"
                    placeholder="Votre réponse..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="reply-actions">
                    <button
                      className="reply-delete-btn"
                      onClick={(e) => {
                        handleDelete(selectedMessage.id, e);
                        closeDetails();
                      }}
                    >
                      <Trash2 size={16} /> Supprimer
                    </button>
                    <button
                      className="reply-btn"
                      onClick={handleReply}
                      disabled={!replyText.trim() || sendingReply}
                    >
                      <Send size={16} /> {sendingReply ? "Envoi..." : "Répondre"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ------------------------------------------------------------
   THÈME PERSONNALISÉ : Dégradé #0f4c75 → #bf5700
------------------------------------------------------------ */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

.message-page {
  --primary-dark: #0f4c75;
  --primary-orange: #bf5700;
  --brand-gradient: linear-gradient(135deg, #0f4c75, #bf5700);
  --brand-light: #e67e22;
  --brand-soft: #f39c12;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --bg-primary: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border-light: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
  --shadow-colored: 0 10px 15px -3px rgba(15, 76, 117, 0.3);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
  min-height: 100vh;
  position: relative;
}

/* Effet de fond subtil avec les nouvelles couleurs */
.message-page::before {
  content: '';
  position: fixed;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(15, 76, 117, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.message-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* En-tête */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: var(--brand-gradient);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-colored);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.header-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.header-title h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f4c75, #bf5700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.header-badge {
  background: rgba(15, 76, 117, 0.1);
  color: #0f4c75;
  padding: 0.3rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(15, 76, 117, 0.2);
}

/* Cartes statistiques */
.message-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--brand-gradient);
  border-radius: 4px 0 0 4px;
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(15, 76, 117, 0.1), rgba(191, 87, 0, 0.1));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 26px;
  height: 26px;
  color: #0f4c75;
}

.stat-content h3 {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-content p {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
}

/* Filtres */
.message-filters {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 1.2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  flex: 1;
  min-width: 280px;
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 2px solid var(--border-light);
  border-radius: 40px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--bg-primary);
}

.search-box input:focus {
  outline: none;
  border-color: #bf5700;
  box-shadow: 0 0 0 4px rgba(191, 87, 0, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--border-light);
  background: white;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #bf5700;
  color: #bf5700;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.filter-btn.active {
  background: var(--brand-gradient);
  border-color: transparent;
  color: white;
  box-shadow: var(--shadow-colored);
}

.filter-btn.active svg {
  color: white;
}

/* Tableau */
.message-table-wrapper {
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  overflow: auto;
  border: 1px solid var(--border-light);
}

.message-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  min-width: 700px;
}

.message-table thead tr {
  background: linear-gradient(145deg, var(--bg-primary), white);
  border-bottom: 2px solid var(--border-light);
}

.message-table th {
  text-align: left;
  padding: 1.2rem 1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.message-table tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: var(--transition);
  cursor: pointer;
  animation: slideInRow 0.5s ease-out;
  animation-fill-mode: both;
}

@keyframes slideInRow {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.message-table tbody tr:hover {
  background: linear-gradient(145deg, white, #fff7f0);
  transform: scale(1.01);
  box-shadow: var(--shadow-md);
  z-index: 1;
  position: relative;
}

.message-table td {
  padding: 1.2rem 1rem;
  color: var(--text-secondary);
}

.message-preview {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-muted);
}

/* Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: var(--transition);
  cursor: default;
}

.status-badge.non-lu {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-badge.lu {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-badge.important {
  background: #fed7aa;
  color: #c2410c;
  border: 1px solid #fdba74;
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  opacity: 0.5;
  transition: var(--transition);
}

tr:hover .action-buttons {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-bounce);
  background: white;
  border: 1px solid var(--border-light);
}

.action-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: var(--shadow-md);
}

.action-btn.view {
  color: #0f4c75;
  border-color: rgba(15, 76, 117, 0.2);
}

.action-btn.view:hover {
  background: linear-gradient(135deg, #0f4c75, #bf5700);
  color: white;
  border-color: transparent;
}

.action-btn.delete {
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.2);
}

.action-btn.delete:hover {
  background: var(--danger);
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid var(--border-light);
  background: white;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #bf5700;
  color: #bf5700;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.pagination-btn.active {
  background: var(--brand-gradient);
  border-color: transparent;
  color: white;
  box-shadow: var(--shadow-colored);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* États vides */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state svg {
  width: 80px;
  height: 80px;
  color: var(--text-light);
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* Loading */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-light);
  border-top-color: #0f4c75;
  border-right-color: #bf5700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUpModal 0.4s ease-out;
  border: 1px solid rgba(15, 76, 117, 0.08);
}

@keyframes slideUpModal {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(145deg, white, var(--bg-primary));
  position: sticky;
  top: 0;
  z-index: 2;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f4c75, #bf5700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: var(--bg-primary);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: var(--danger);
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  background: radial-gradient(circle at 90% 10%, rgba(15, 76, 117, 0.04), transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(191, 87, 0, 0.04), transparent 40%);
}

.message-detail-item {
  margin-bottom: 1.2rem;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 0.9rem 1rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.message-detail-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: rgba(191, 87, 0, 0.3);
}

.message-detail-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.message-detail-value {
  font-size: 1rem;
  color: var(--text-primary);
  background: linear-gradient(145deg, #ffffff, var(--bg-primary));
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  font-weight: 500;
}

.message-detail-value a {
  color: #0f4c75;
  text-decoration: none;
  font-weight: 600;
}

.message-detail-value a:hover {
  color: #bf5700;
  text-decoration: underline;
}

.message-detail-value.message-content {
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
}

.reply-section {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: white;
  border: 1px dashed rgba(191, 87, 0, 0.4);
  border-radius: 16px;
  padding: 1rem;
}

.reply-textarea {
  width: 100%;
  border: 2px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  transition: var(--transition);
  resize: vertical;
  min-height: 120px;
}

.reply-textarea:focus {
  outline: none;
  border-color: #bf5700;
  box-shadow: 0 0 0 4px rgba(191, 87, 0, 0.1);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.reply-btn {
  background: var(--brand-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-colored);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reply-delete-btn {
  background: white;
  color: var(--danger);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  padding: 0.75rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reply-delete-btn:hover {
  background: var(--danger);
  color: white;
}

.reply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.reply-btn:disabled,
.reply-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Avatar */
.avatar {
  background: linear-gradient(135deg, #0f4c75, #bf5700);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .message-container {
    padding: 1rem;
  }
  .header-title h1 {
    font-size: 1.8rem;
  }
  .stat-content p {
    font-size: 1.4rem;
  }
  .action-buttons {
    opacity: 1;
  }
}
      `}</style>
    </div>
  );
};

export default ContactAdmin;