import React, { useEffect, useState, useMemo } from "react";
import BookCard from "./BookCard";
import { addFavorite } from "./bookService";
import "./Books.css";

// **Import des images**
import imgPetitPrince from "./images.jpg";
import imgEtranger from "./9782070360024_1_75_2.jpg";
import img1984 from "./602662c_KnplFM1ut3a-e_tLsHzIB6cL.avif";
import imgCandide from "./images1.jpg";
import imgPeste from "./9782701161662_1_75.jpg";

export default function Books({ favorites, setFavorites }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  // Livres ajoutés manuellement
  const manualBooks = [
    { _id: "m1", title: "Le Petit Prince", author: "A. de Saint-Exupéry", rating: 5, image: imgPetitPrince },
    { _id: "m2", title: "L'Étranger", author: "Albert Camus", rating: 4.5, image: imgEtranger },
    { _id: "m3", title: "1984", author: "George Orwell", rating: 5, image: img1984 },
    { _id: "m4", title: "Candide", author: "Voltaire", rating: 4, image: imgCandide },
    { _id: "m5", title: "La Peste", author: "Albert Camus", rating: 4, image: imgPeste },
  ];

  useEffect(() => {
    // Si tu as un backend, tu peux fetch ici
    setBooks([...manualBooks]); // pour l'instant juste les livres manuels
  }, []);

  // Supprimer un livre
  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  // Ajouter aux favoris
  const handleAddFavorite = async (book) => {
    if (!favorites.some((b) => b._id === book._id)) {
      // client-side add (persisted in localStorage via App)
      const item = { _id: book._id, title: book.title, author: book.author, image: book.image };
      setFavorites([...favorites, item]);
    }
  };

  // Retirer des favoris
  const handleRemoveFavorite = (book) => {
    setFavorites(favorites.filter((b) => b._id !== book._id));
  };

  // Filtrage
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }, [query, books]);

  return (
    <div className="books-page">
      <div className="books-hero">
        <div className="title-area">
          <h2>Mes livres</h2>
          <span className="book-count">{filtered.length} livre{filtered.length > 1 ? 's' : ''}</span>
        </div>
        <div className="controls">
          <input
            className="search-bar"
            placeholder="Rechercher un titre ou un auteur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="book-list">
        {filtered.map((b) => (
          <BookCard
            key={b._id}
            book={b}
            favorites={favorites}
            onDelete={handleDelete}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
}





