import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function AdminLayout({ children }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/', { replace: true });
  }

  const isDashboard = location.pathname === '/admin';

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link to="/admin" className="admin-brand">
          <span className="admin-brand-mark">T</span>
          <span>Taklifnoma</span>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className={isDashboard ? 'active' : ''}>
            Invitationlar
          </Link>
          <Link to="/admin/create" className="admin-nav-cta">
            + Create Invitation
          </Link>
        </nav>

        <div className="admin-user">
          <span className="admin-user-email">{user?.email}</span>
          <button onClick={handleLogout} className="admin-logout">
            Chiqish
          </button>
        </div>
      </header>

      <main className="admin-main">{children}</main>

      <style>{`
        .admin-shell {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--admin-bg);
        }
        .admin-topbar {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 32px;
          padding: 14px 32px;
          min-height: 64px;
          border-bottom: 1px solid var(--admin-border);
          background: var(--admin-surface);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          color: var(--admin-text);
          flex-shrink: 0;
        }
        .admin-brand-mark {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--admin-accent);
          color: #14161b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .admin-nav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px 20px;
          flex: 1;
          min-width: 0;
        }
        .admin-nav a {
          font-size: 13.5px;
          color: var(--admin-text-dim);
          padding: 8px 4px;
        }
        .admin-nav a.active { color: var(--admin-text); }
        .admin-nav-cta {
          margin-left: auto;
          background: var(--admin-accent);
          color: #14161b !important;
          padding: 8px 16px !important;
          border-radius: 7px;
          font-weight: 600;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .admin-user-email {
          font-size: 12.5px;
          color: var(--admin-text-dim);
        }
        .admin-logout {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-dim);
          padding: 7px 14px;
          border-radius: 7px;
          font-size: 12.5px;
        }
        .admin-logout:hover { color: var(--admin-text); border-color: var(--admin-text-dim); }
        .admin-main {
          flex: 1;
          width: 100%;
          padding: 32px;
        }
        @media (max-width: 720px) {
          .admin-topbar { padding: 12px 16px; gap: 12px 16px; }
          .admin-user-email { display: none; }
          .admin-main { padding: 16px; }
        }
        @media (max-width: 480px) {
          .admin-topbar { gap: 10px; }
          .admin-brand span:last-child { display: none; }
          .admin-nav { gap: 10px 14px; order: 3; flex-basis: 100%; }
          .admin-nav-cta { padding: 7px 12px !important; font-size: 12.5px; }
          .admin-user { margin-left: auto; }
        }
      `}</style>
    </div>
  );
}
