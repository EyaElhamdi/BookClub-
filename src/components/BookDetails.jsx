import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"; // on utilise axios directement si api.js n'existe pas
import "./BookDetails.css";

export default function BookDetails({ favorites = [], setFavorites, onAddFavorite, onRemoveFavorite }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showExcerpt, setShowExcerpt] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        if (mounted) setBook(res.data);
      } catch (err) {
        console.error("Erreur lors du fetch du livre :", err);
        if (mounted) setBook(null);
      }
    };

    fetchBook();
    return () => (mounted = false);
  }, [id]);

  if (!book) return <p style={{ textAlign: "center" }}>Chargement du livre...</p>;

  const longDesc = book.longDescription || book.description || "Pas de description disponible.";
  const short = longDesc.slice(0, 420);

  const teaser = book.teaser || (longDesc.slice(0, 160) + (longDesc.length > 160 ? '…' : ''));
  const characters = book.characters || [];
  const chapters = book.chapters || [];
  const excerpt = book.excerpt || book.sample || "Aucun extrait disponible.";

  const avgRating = book.rating || (book.reviews && book.reviews.length
    ? (book.reviews.reduce((a, b) => a + b.rating, 0) / book.reviews.length).toFixed(1)
    : "N/A"
  );

  const renderStars = (r) => {
    const n = Math.round(r);
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < n ? '#ffb3c9' : '#e6cbd2' }}>★</span>
    ));
  };

  const isFav = favorites.some((f) => f._id === book._id);

  const handleToggleFav = () => {
    if (isFav) {
      if (typeof onRemoveFavorite === "function") return onRemoveFavorite(book);
      if (setFavorites) setFavorites((prev) => prev.filter((f) => f._id !== book._id));
      return;
    }
    if (typeof onAddFavorite === "function") return onAddFavorite(book);
    if (setFavorites) setFavorites((prev = []) => [...prev, { _id: book._id, title: book.title, author: book.author, image: book.image }]);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        // fallback
        const el = document.createElement('textarea');
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedMessage('Lien copié !');
      setTimeout(() => setCopiedMessage(''), 1800);
    } catch (err) {
      console.error('Copy failed', err);
      setCopiedMessage('Erreur lors de la copie');
      setTimeout(() => setCopiedMessage(''), 1800);
    }
  };

  const handleShare = async () => {
    const payload = { title: book.title, text: teaser, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch (err) {
        // user cancelled or error
      }
      return;
    }
    // fallback to copy
    handleCopyLink();
  };

  return (
    <div className="details-page large">
      <div className="details-grid">
        {book.image && <img className="cover" src={book.image} alt={book.title} />}

        <div className="details-meta">
          <h1>{book.title}</h1>
          <div className="meta-top">
            <div className="author-block">
              <div className="author-name">{book.author}</div>
              <div className="author-bio">{book.authorBio}</div>
            </div>

            <div className="rating-block">
              <div className="rating-big">{avgRating}</div>
              <div className="stars">{renderStars(avgRating)}</div>
            </div>
          </div>

          <div className="meta-row">
            <span><strong>Éditeur :</strong> {book.publisher || "—"}</span>
            <span><strong>Année :</strong> {book.year || "—"}</span>
            <span><strong>Pages :</strong> {book.pages || "—"}</span>
          </div>

          <p className="isbn"><strong>ISBN :</strong> {book.isbn || "—"}</p>

          <div className="tags" style={{ marginTop: 12 }}>
            {(book.genres || []).map((g, i) => (
              <span className="tag" key={i}>{g}</span>
            ))}
          </div>

          <div className="description" style={{ marginTop: 18 }}>
            <p className="desc-text teaser">{teaser}</p>
            <p className="desc-text">
              {expanded ? longDesc : `${short}${longDesc.length > 420 ? '…' : ''}`}
            </p>
            {longDesc.length > 420 && (
              <button className="read-more" onClick={() => setExpanded(s => !s)}>
                {expanded ? 'Réduire' : 'Lire la suite'}
              </button>
            )}
            <div style={{ marginTop: 8 }}>
              <button className="secondary" onClick={() => setShowExcerpt(true)}>Lire un extrait</button>
              <button className="secondary" onClick={handleCopyLink}>Copier le lien</button>
              <button className="secondary" onClick={handleShare}>Partager</button>
              {copiedMessage && <span className="share-feedback">{copiedMessage}</span>}
            </div>
          </div>

          {characters.length > 0 && (
            <section className="characters">
              <h3>Personnages</h3>
              <ul>
                {characters.map((c, i) => (
                  <li key={i}><strong>{c.name}</strong>{c.role ? ` — ${c.role}` : ''}{c.description ? `: ${c.description}` : ''}</li>
                ))}
              </ul>
            </section>
          )}

          {chapters.length > 0 && (
            <section className="chapters">
              <h3>Chapitres</h3>
              <ol>
                {chapters.map((c, i) => (<li key={i}>{c}</li>))}
              </ol>
            </section>
          )}

          <section className="reviews">
            <h3>Avis</h3>
            {book.reviews && book.reviews.length ? (
              <ul>
                {book.reviews.map((r, idx) => (
                  <li key={idx} className="review-item">
                    <div className="review-head"><strong>{r.user}</strong> — <span className="small-rating">{r.rating}/5</span></div>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun avis pour l'instant.</p>
            )}
          </section>

          <div className="actions-row">
            <button className="primary" onClick={handleToggleFav}>{isFav ? "Retirer des favoris" : "Ajouter aux favoris"}</button>
            <a className="buy-link" href={book.buyLink || '#'} target="_blank" rel="noreferrer">Acheter</a>
            <Link to="/books" className="back-link">← Retour à la liste</Link>
          </div>
        </div>
      </div>

      {showExcerpt && (
        <div className="sample-modal" role="dialog" aria-modal="true">
          <div className="sample-box">
            <h3>Extrait — {book.title}</h3>
            <pre className="excerpt-text">{excerpt}</pre>
            <div style={{ marginTop: 8 }}>
              <button className="cm-btn cm-cancel" onClick={() => setShowExcerpt(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



