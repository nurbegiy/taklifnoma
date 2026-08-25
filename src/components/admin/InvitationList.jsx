import { Link } from 'react-router-dom';
import { formatDateLong } from '../../lib/utils';

const DESIGN_LABEL = { dark: 'Dark Luxury', warm: 'Warm Elegant', light: 'Light Romantic' };

export default function InvitationList({ invitations, onDelete }) {
  if (invitations.length === 0) {
    return (
      <div className="inv-list-empty">
        <p>Hozircha invitation yo&#8217;q.</p>
        <Link to="/admin/create" className="inv-list-empty-cta">
          + Birinchi invitationni yarating
        </Link>
        <style>{`
          .inv-list-empty {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 14px; padding: 100px 20px; color: var(--admin-text-dim); text-align: center;
          }
          .inv-list-empty-cta {
            background: var(--admin-accent); color: #14161b; padding: 10px 20px; border-radius: 8px;
            font-size: 13.5px; font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="inv-list">
      <table>
        <thead>
          <tr>
            <th>Juftlik</th>
            <th>Sana</th>
            <th>Dizayn</th>
            <th>Slug</th>
            <th>Holat</th>
            <th>Yaratilgan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id}>
              <td className="inv-list-names">{inv.bride_name} &amp; {inv.groom_name}</td>
              <td>{formatDateLong(inv.wedding_date)}</td>
              <td>
                <span className="inv-list-badge">{DESIGN_LABEL[inv.design] || inv.design}</span>
              </td>
              <td className="inv-list-slug">/{inv.slug}</td>
              <td>
                <span className={`inv-list-status inv-list-status--${inv.status}`}>
                  {inv.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="inv-list-dim">{new Date(inv.created_at).toLocaleDateString('uz-UZ')}</td>
              <td className="inv-list-actions">
                <Link to={`/admin/edit/${inv.id}`}>Edit</Link>
                <a href={`/${inv.slug}`} target="_blank" rel="noreferrer">Preview</a>
                <button onClick={() => onDelete(inv)} className="inv-list-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .inv-list { width: 100%; overflow-x: auto; background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: var(--radius); }
        table { width: 100%; border-collapse: collapse; min-width: 780px; }
        th {
          text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--admin-text-dim); padding: 14px 16px; border-bottom: 1px solid var(--admin-border);
        }
        td { padding: 14px 16px; font-size: 13.5px; border-bottom: 1px solid var(--admin-border); color: var(--admin-text); }
        tr:last-child td { border-bottom: none; }
        .inv-list-names { font-weight: 600; }
        .inv-list-slug { color: var(--admin-text-dim); font-family: monospace; }
        .inv-list-dim { color: var(--admin-text-dim); }
        .inv-list-badge {
          font-size: 11px; padding: 4px 10px; border-radius: 999px; background: var(--admin-surface-2);
          border: 1px solid var(--admin-border); color: var(--admin-text-dim);
        }
        .inv-list-status { font-size: 11.5px; padding: 4px 10px; border-radius: 999px; font-weight: 600; }
        .inv-list-status--published { background: rgba(111,191,139,0.12); color: var(--admin-success); }
        .inv-list-status--draft { background: rgba(154,161,173,0.12); color: var(--admin-text-dim); }
        .inv-list-actions { display: flex; gap: 14px; white-space: nowrap; }
        .inv-list-actions a { color: var(--admin-accent); font-size: 12.5px; }
        .inv-list-delete { background: none; border: none; color: var(--admin-danger); font-size: 12.5px; padding: 0; }
      `}</style>
    </div>
  );
}
