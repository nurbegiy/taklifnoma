import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { listInvitations, deleteInvitation } from '../services/invitationService';
import InvitationList from '../components/admin/InvitationList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorState from '../components/ErrorState.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const data = await listInvitations(user.id);
      setInvitations(data);
    } catch (err) {
      setError(err.message || 'Yuklashda xatolik.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleDelete(inv) {
    if (!confirm(`"${inv.bride_name} & ${inv.groom_name}" invitationni o\u2018chirishni tasdiqlaysizmi?`)) return;
    try {
      await deleteInvitation(inv.id);
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } catch (err) {
      alert(err.message || 'O\u2018chirishda xatolik.');
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (invitations === null) return <LoadingSpinner fullScreen={false} label="Invitationlar yuklanmoqda..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Invitationlar</h1>
        <span className="dashboard-count">{invitations.length} ta</span>
      </div>
      <InvitationList invitations={invitations} onDelete={handleDelete} />

      <style>{`
        .dashboard { width: 100%; }
        .dashboard-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
        .dashboard-header h1 { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; margin: 0; color: var(--admin-text); }
        .dashboard-count { font-size: 13px; color: var(--admin-text-dim); }
      `}</style>
    </div>
  );
}
