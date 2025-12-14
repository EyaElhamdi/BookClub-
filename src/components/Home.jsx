import React from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import CoverCard from "./CoverCard";
import imgPetitPrince from "./images.jpg";
import imgEtranger from "./9782070360024_1_75_2.jpg";
import img1984 from "./602662c_KnplFM1ut3a-e_tLsHzIB6cL.avif";
import imgCandide from "./images1.jpg";
import imgPeste from "./9782701161662_1_75.jpg";
import "./Home.css";

export default function Home({ favorites = [], setFavorites }) {
  // Livres affichés manuellement dans "Mes livres"
  const previewBooks = [
    { id: 1, title: "Le Petit Prince", author: "A. de Saint-Exupéry", image: imgPetitPrince },
    { id: 2, title: "L'Étranger", author: "Albert Camus", image: imgEtranger },
    { id: 3, title: "1984", author: "George Orwell", image: img1984 },
    { id: 4, title: "Candide", author: "Voltaire", image: imgCandide },
    { id: 5, title: "La Peste", author: "Albert Camus", image: imgPeste },
  ];

  // Etagères avec sélection manuelle
  const romans = [
    { id: 101, title: "Tintin: Le Secret de la Licorne", author: "Hergé", image: imgEtranger },
    { id: 102, title: "Astérix le Gaulois", author: "Goscinny & Uderzo", image: imgPetitPrince },
    { id: 103, title: "One Piece Vol.1", author: "Eiichiro Oda", image: img1984 },
    { id: 104, title: "Naruto Vol.1", author: "Masashi Kishimoto", image: imgPeste },
    { id: 105, title: "Dragon Ball Vol.1", author: "Akira Toriyama", image: imgCandide },
  ];

  const jeunesse = [
    { id: 201, title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", image: img1984 },
    { id: 202, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", image: imgPetitPrince },
    { id: 203, title: "Charlie et la chocolaterie", author: "Roald Dahl", image: imgCandide },
    { id: 204, title: "Le Château de ma mère", author: "Marcel Pagnol", image: imgPeste },
    { id: 205, title: "Les Malheurs de Sophie", author: "Comtesse de Ségur", image: imgEtranger },
  ];

  return (
    <main className="home-container">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Bienvenue sur Book Club</h1>
          <p className="hero-sub">
            Partagez vos lectures, découvrez des favoris, et échangez avec la communauté.
          </p>
          <div className="cta-row">
            <Link to="/books" className="primary">Parcourir les livres</Link>
            <Link to="/favorites" className="view-btn">Mes favoris</Link>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden>
          <div className="book-stack" />
        </div>
      </section>

      <section className="recent">
        <h2 className="section-title">Mes livres</h2>
        <div className="top-books">
          <div className="book-list">
            {previewBooks.map((b) => (
              <BookCard key={b.id} book={b} onDelete={() => {}} favorites={favorites} setFavorites={setFavorites} />
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <Link to="/books" className="view-btn">Voir toute la collection →</Link>
          </div>
        </div>
      </section>

      <section className="shelves">
        <div className="shelf">
          <div className="shelf-head">
            <h3>Romans et Littérature</h3>
            <Link to="/books" className="view-btn">Voir</Link>
          </div>
          <div className="shelf-row">
            {romans.map((b) => (
              <CoverCard key={b.id} book={b} />
            ))}
          </div>
        </div>

        <div className="shelf">
          <div className="shelf-head">
            <h3>Jeunesse</h3>
            <Link to="/books" className="view-btn">Voir</Link>
          </div>
          <div className="shelf-row">
            {jeunesse.map((b) => (
              <CoverCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


