import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// User
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";

// Admin
import UsersPage from "./components/UsersPage.jsx";

// Books
import Home from "./components/Home.jsx";
import Books from "./components/Books.jsx";
import BookDetails from "./components/BookDetails.jsx";
import FavoriteBooks from "./components/FavoriteBooks.jsx";

// Layout
import Header from "./components/Header.jsx";

function AppRoutes() {
  const { token, role } = useAuth();
  const isAuthenticated = !!token;
  /* =========================
     FAVORITES (localStorage)
  ========================== */
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

    /* auth via AuthContext (no local state here) */

  return (
    <Router>
      <Header />

      <Routes>
        {/* Redirection par défaut */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Utilisateur */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile favorites={favorites} setFavorites={setFavorites} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/edit-profile"
          element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
        />

        {/* Pages principales */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home favorites={favorites} setFavorites={setFavorites} /> : <Navigate to="/login" />}
        />

        <Route
          path="/books"
          element={
            isAuthenticated ? (
              <Books favorites={favorites} setFavorites={setFavorites} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/books/:id"
          element={isAuthenticated ? (
            <BookDetails favorites={favorites} setFavorites={setFavorites} onAddFavorite={(b)=>{
              const exists = favorites.some((f)=>f._id===b._id);
              if (!exists) setFavorites([...favorites, { _id: b._id, title: b.title, author: b.author, image: b.image }]);
            }} onRemoveFavorite={(b)=> setFavorites(favorites.filter(f=>f._id!==b._id))} />
          ) : (
            <Navigate to="/login" />
          )}
        />

        <Route
          path="/favorites"
          element={
            isAuthenticated ? (
              <FavoriteBooks
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <UsersPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}






















