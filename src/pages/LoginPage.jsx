import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) {
    navigate('/admin', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);
    if (!res.success) {
      setError('Login yoki parol noto\u2018g\u2018ri.');
      return;
    }
    navigate('/admin', { replace: true });
  }

  return (
    <div className="login-screen">
      <div className="login-visual">
        <div className="login-visual-inner">
          <span className="login-eyebrow">Taklifnoma</span>
          <h1 className="login-title">
            Har bir to&#8217;y &mdash;<br />o&#8217;z hikoyasi bilan.
          </h1>
          <p className="login-sub">
            Online taklifnomalarni shu yerdan boshqaring: ma&#8217;lumot kiriting, dizayn
            tanlang, mijozga bitta chiroyli havola bering.
          </p>
        </div>
        <div className="login-visual-corner" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <path d="M10 190C10 100 100 10 190 10" stroke="#c9a86a" strokeWidth="1" opacity="0.5" />
            <path d="M30 190C30 115 115 30 190 30" stroke="#c9a86a" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      </div>

      <div className="login-form-pane">
        <form className="login-form" onSubmit={handleSubmit}>
          <span className="login-form-label">Admin kirish</span>
          <h2 className="login-form-title">Xush kelibsiz</h2>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@taklifnoma.uz"
              required
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Parol</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>

      <style>{`
        .login-screen {
          width: 100vw;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
        }
        .login-visual {
          position: relative;
          background: radial-gradient(120% 120% at 20% 15%, #232a3a 0%, #141824 55%, #0e1119 100%);
          padding: 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .login-visual-inner { max-width: 480px; z-index: 1; }
        .login-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #c9a86a;
        }
        .login-title {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          font-size: 42px;
          line-height: 1.2;
          color: #f2ede1;
          margin: 20px 0 18px;
        }
        .login-sub {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: #9aa1ad;
          max-width: 380px;
        }
        .login-visual-corner {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 220px;
          height: 220px;
        }
        .login-form-pane {
          background: #0f1115;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .login-form {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
        }
        .login-form-label {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6b7280;
          font-family: 'Jost', sans-serif;
        }
        .login-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #eef0f3;
          margin: 8px 0 32px;
          font-weight: 500;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .field span {
          font-size: 12px;
          color: #9aa1ad;
          letter-spacing: 0.4px;
        }
        .field input {
          background: #171a21;
          border: 1px solid #2a2f3a;
          border-radius: 8px;
          padding: 13px 14px;
          color: #eef0f3;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .field input:focus {
          border-color: #c9a86a;
        }
        .login-error {
          background: rgba(226,104,95,0.1);
          border: 1px solid rgba(226,104,95,0.35);
          color: #e2685f;
          font-size: 13px;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 18px;
        }
        .login-submit {
          background: #c9a86a;
          color: #14161b;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: background 0.15s ease;
        }
        .login-submit:hover:not(:disabled) { background: #d8bb84; }
        .login-submit:disabled { opacity: 0.6; cursor: default; }

        @media (max-width: 860px) {
          .login-screen { grid-template-columns: 1fr; }
          .login-visual { display: none; }
          .login-form-pane { min-height: 100vh; }
        }
      `}</style>
    </div>
  );
}
