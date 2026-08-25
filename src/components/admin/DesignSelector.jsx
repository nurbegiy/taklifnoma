const DESIGNS = [
  {
    id: 'dark',
    name: 'Dark Luxury',
    desc: 'To\u2018q navy fon, oltin detallar, premium serif.',
    swatch: ['#1c2230', '#c9a86a', '#f2ede1'],
  },
  {
    id: 'warm',
    name: 'Warm Elegant',
    desc: 'Iliq jigar-bej ranglar, botanik chiziqlar.',
    swatch: ['#a9744c', '#f3e2c4', '#5b3a22'],
  },
  {
    id: 'light',
    name: 'Light Romantic',
    desc: 'Oq-krem fon, yumshoq pushti aksentlar.',
    swatch: ['#fffaf6', '#f2a68a', '#8a5a4a'],
  },
];

export default function DesignSelector({ value, onChange }) {
  return (
    <div className="design-selector">
      {DESIGNS.map((d) => (
        <button
          type="button"
          key={d.id}
          className={`design-card ${value === d.id ? 'selected' : ''}`}
          onClick={() => onChange(d.id)}
        >
          <div className="design-swatch">
            {d.swatch.map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <div className="design-name">{d.name}</div>
          <div className="design-desc">{d.desc}</div>
          {value === d.id && <div className="design-check">Tanlandi</div>}
        </button>
      ))}

      <style>{`
        .design-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .design-card {
          text-align: left;
          background: var(--admin-surface);
          border: 1.5px solid var(--admin-border);
          border-radius: var(--radius);
          padding: 16px;
          transition: border-color 0.15s ease, transform 0.1s ease;
        }
        .design-card:hover { border-color: #454c5a; }
        .design-card.selected { border-color: var(--admin-accent); }
        .design-swatch {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        .design-swatch span {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .design-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text);
          margin-bottom: 4px;
        }
        .design-desc {
          font-size: 12px;
          color: var(--admin-text-dim);
          line-height: 1.5;
        }
        .design-check {
          margin-top: 10px;
          font-size: 11px;
          color: var(--admin-accent);
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        @media (max-width: 640px) {
          .design-selector { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
