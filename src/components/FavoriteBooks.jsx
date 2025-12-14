import React, { useState } from "react";
import BookCard from "./BookCard";
import AddBookModal from "./AddBookModal";
import { addFavorite, deleteBook as deleteBookAPI } from "./bookService"; // ajouter deleteBook si tu veux le backend
import "./FavoriteBooks.css";

export default function FavoriteBooks({ favorites = [], setFavorites }) {
  const [showModal, setShowModal] = useState(false);

  // Ajouter un livre aux favoris via le backend
  const addBook = async (book) => {
    try {
      const saved = await addFavorite(book);
      if (saved && setFavorites) {
        setFavorites([...favorites, saved]);
        return;
      }
      // fallback client-side if backend not available
      if (setFavorites) setFavorites([...favorites, { _id: book._id || book.title, title: book.title, author: book.author, image: book.image }]);
    } catch (err) {
      console.error("Erreur lors de l'ajout du favori :", err);
      if (setFavorites) setFavorites([...favorites, { _id: book._id || book.title, title: book.title, author: book.author, image: book.image }]);
    }
  };

  // Supprimer un livre des favoris (backend si nécessaire)
  const deleteBook = async (id) => {
    try {
      await deleteBookAPI(id); // supprimer côté backend
      if (setFavorites) {
        setFavorites(favorites.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du livre :", err);
    }
  };

  return (
    <section className="favorites-section">
      <h3>📖 Mes livres favoris</h3>

      {favorites.length > 0 ? (
        <div className="book-list">
          {favorites.slice(0, 3).map((book) => (
            <BookCard
              key={book._id || book.title}
              book={book}
              onDelete={deleteBook}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          ))}
        </div>
      ) : (
        <p className="empty-text">Aucun livre favori pour le moment 📚</p>
      )}

      <div className="buttons">
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Ajouter un livre
        </button>
        <button className="view-btn" onClick={() => window.location.href = "/favorites"}>
          Voir plus →
        </button>
      </div>

      {showModal && <AddBookModal onAdd={addBook} onClose={() => setShowModal(false)} />}
    </section>
  );
}






