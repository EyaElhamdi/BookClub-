import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersPage.css";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";
import api from "../services/api";

/* ---------- Navbar ---------- */
function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul>
        <li onClick={handleLogout} style={{ cursor: "pointer" }}>
          🚪 Déconnexion
        </li>
      </ul>
    </nav>
  );
}

/* ---------- AddUserForm ---------- */
function AddUserForm({ onAdd }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert("Nom, prénom et email sont obligatoires !");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/users", { firstName, lastName, email, password: "123456", role });
      const data = res.data;
      console.log("ADD USER RAW RESPONSE:", data);
      onAdd(data.user);

      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("user");
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Nom"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={loading}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
}

/* ---------- SearchBar ---------- */
function SearchBar({ search, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Recherche..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

/* ---------- UserTable ---------- */
function UserTable({ users, onDelete }) {
  const [pending, setPending] = React.useState(null);

  const confirmDelete = (id) => {
    setPending(id);
  };

  const doDelete = () => {
    if (pending) {
      onDelete(pending);
      setPending(null);
    }
  };

  const cancelDelete = () => setPending(null);
  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">
                Aucun utilisateur
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => confirmDelete(user._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* confirmation modal */}
      {pending && (
        <ConfirmModal
          isOpen={!!pending}
          title="Supprimer l'utilisateur"
          message="Confirmez-vous la suppression de cet utilisateur ?"
          onConfirm={doDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

/* ---------- UsersPage ---------- */
export default function UsersPage() {
  const navigate = useNavigate();
  const { token, role: ctxRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const role = ctxRole;
    if (!role || role.toLowerCase() !== "admin") {
      navigate("/login");
    }
  }, [navigate, ctxRole]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const data = res.data;
        console.log("RAW RESPONSE FROM BACKEND:", data);
        setUsers(data);
      } catch (err) {
        alert("Erreur chargement : " + (err.response?.data?.message || err.message));
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleAddUser = (user) => setUsers((prev) => [...prev, user]);

  const handleDeleteUser = async (id) => {
    try {
      // handled by modal in table row
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Erreur suppression: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.firstName + " " + u.lastName).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <section className="users-page">
          <h1>Gestion des utilisateurs 👥</h1>
          <AddUserForm onAdd={handleAddUser} />
          <SearchBar search={search} onSearch={setSearch} />
          <UserTable users={filteredUsers} onDelete={handleDeleteUser} />
        </section>
      </main>
    </div>
  );
}












