import { useState } from 'react';

export default function Gallery({ photos }) {
  const [active, setActive] = useState(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="inv-gallery">
      <div className="inv-gallery-grid">
        {photos.map((p, i) => (
          <button
            type="button"
            key={p.id || p.url}
            className="inv-gallery-item"
            style={{ animationDelay: `${i * 70}ms` }}
            onClick={() => setActive(p.url)}
          >
            <img src={p.url} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      {active && (
        <div className="inv-gallery-lightbox" onClick={() => setActive(null)}>
          <img src={active} alt="" />
        </div>
      )}
    </div>
  );
}
