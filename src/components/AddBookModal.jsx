import React, { useState } from "react";
import axios from "axios";

function AddBookModal({ onClose, onAdd }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    rating: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST vers le backend
      const response = await axios.post("http://localhost:5000/api/books", book);
      if (response.data) {
        onAdd(response.data); // renvoyer le livre ajouté
      }
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'ajout du livre :", err);
      alert("Erreur lors de l'ajout du livre. Vérifiez la console.");
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h3>Ajouter un livre</h3>

        <input
          placeholder="Titre"
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
        />
        <input
          placeholder="Auteur"
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          required
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Note"
          onChange={(e) => setBook({ ...book, rating: e.target.value })}
        />
        <input
          placeholder="Image URL"
          onChange={(e) => setBook({ ...book, image: e.target.value })}
        />

        <button type="submit">Ajouter</button>
        <button type="button" onClick={onClose}>
          Annuler
        </button>
      </form>
    </div>
  );
}

export default AddBookModal;

