import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";

export default function BookCard({ book, onDelete, favorites = [], setFavorites, onAddFavorite, onRemoveFavorite }) {
  const location = useLocation();
  // Placeholder pour l'image
  const publicPlaceholder = "/book-placeholder.svg";
  const inlineFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480">
        <rect width="100%" height="100%" fill="#fff4f8"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b4345c" font-family="Arial, Helvetica, sans-serif" font-size="18">
          No Image
        </text>
      </svg>`
    );

  const initial = book.image || publicPlaceholder || inlineFallback;
  const [src, setSrc] = useState(initial);

  const handleError = () => {
    if (src !== publicPlaceholder) {
      setSrc(publicPlaceholder);
      return;
    }
    if (src !== inlineFallback) {
      setSrc(inlineFallback);
      return;
    }
  };

  // Vérifie si le livre est déjà dans les favoris
  const isFav = favorites.some((f) => f._id === book._id);

  // Ajouter ou retirer des favoris
  const toggleFavorite = (e) => {
    e && e.stopPropagation();
    const exists = favorites.some((f) => f._id === book._id);
    if (exists) {
      // show confirmation before removing from favorites
      return setShowUnfavConfirm(true);
    }

    // add
    if (typeof onAddFavorite === "function") return onAddFavorite(book);
    if (!setFavorites) return;
    setFavorites((prev = []) => [...prev, { _id: book._id, title: book.title, author: book.author, image: book.image }]);
  };

  // Supprimer un livre
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUnfavConfirm, setShowUnfavConfirm] = useState(false);
  const handleDeleteClick = async () => setShowConfirm(true);
  const confirmDelete = async () => {
    try {
      if (onDelete) onDelete(book._id); // Supprime localement
      await axios.delete(`http://localhost:5000/api/books/${book._id}`); // Supprime côté backend
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Impossible de supprimer le livre. Vérifiez la console.");
    } finally {
      setShowConfirm(false);
    }
  };

  const confirmUnfav = () => {
    try {
      if (typeof onRemoveFavorite === "function") {
        onRemoveFavorite(book);
        return;
      }
      if (setFavorites) setFavorites((prev = []) => prev.filter((f) => f._id !== book._id));
    } finally {
      setShowUnfavConfirm(false);
    }
  };

  return (
    <div className="book-card">
      <div className="img-wrap">
        {book.rating !== undefined && (
          <div className="rating-pill">⭐ {book.rating || 0}</div>
        )}
        {book.author && (
          <div className="author-badge">{book.author.split(' ')[0]}</div>
        )}
        <img
          src={src}
          alt={book.title}
          loading="lazy"
          onError={handleError}
        />

        <div className="overlay">
          <Link className="cta" to={`/books/${book._id}`} state={{ background: location }}>Voir plus</Link>
        </div>
      </div>

      <div className="card-body">
        <h4>{book.title}</h4>
        <p>{book.author}</p>
        <p className="rating">⭐ {book.rating || 0}/5</p>

        <div className="actions">
          <button className="small-btn" onClick={toggleFavorite}>
            {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
          <button className="small-btn delete-btn" onClick={handleDeleteClick}>Supprimer</button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Supprimer le livre"
        message="Voulez-vous vraiment supprimer ce livre ?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <ConfirmModal
        isOpen={showUnfavConfirm}
        title="Retirer des favoris"
        message={`Voulez-vous retirer "${book.title}" de vos favoris ?`}
        onConfirm={confirmUnfav}
        onCancel={() => setShowUnfavConfirm(false)}
      />
    </div>
  );
}


