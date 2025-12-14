import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./buttons.css";

export default function Header() {
  const location = useLocation();

  // ❌ Pages où le header ne doit PAS apparaître
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null; // ⬅️ cache complètement le header
  }

  const active = (path) =>
    location.pathname === path ? "nav-btn active" : "nav-btn";

  return (
    <header
      style={{
        padding: 12,
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        background: "linear-gradient(180deg,#fff,#fff4f8)",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to="/home" className={active("/home")}>Accueil</Link>
        <Link to="/books" className={active("/books")}>Mes livres</Link>
        <Link to="/favorites" className={active("/favorites")}>Favoris</Link>
        <Link to="/profile" className={active("/profile")}>Profil</Link>
      </nav>
    </header>
  );
}

