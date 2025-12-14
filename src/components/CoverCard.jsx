import React, { useState } from "react";

export default function CoverCard({ book }) {
  const placeholder = "/book-placeholder.svg"; // ou un chemin vers une image locale
  const [src, setSrc] = useState(book.image || placeholder);

  const handleError = () => setSrc(placeholder);

  return (
    <div className="cover-card">
      <img src={src} alt={book.title} onError={handleError} />
      <div className="cover-meta">
        <div className="cover-title">{book.title}</div>
        <div className="cover-author">{book.author}</div>
      </div>
    </div>
  );
}
