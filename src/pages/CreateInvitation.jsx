import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import InvitationForm from '../components/admin/InvitationForm.jsx';
import { createInvitation } from '../services/invitationService';

export default function CreateInvitation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(payload) {
    setSaving(true);
    setError('');
    try {
      const created = await createInvitation(payload, user.id);
      navigate(`/admin/edit/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Yaratishda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="create-page">
      <div className="page-header">
        <h1>Yangi invitation</h1>
        <p>Ma&#8217;lumotlarni kiriting, dizayn tanlang va saqlang. Rasm/musiqa yuklash saqlangandan keyin ochiladi.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      <InvitationForm mode="create" ownerId={user.id} invitation={null} photos={[]} onSave={handleSave} saving={saving} />

      <style>{`
        .create-page { width: 100%; }
        .page-header { margin-bottom: 24px; }
        .page-header h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin: 0 0 6px; color: var(--admin-text); }
        .page-header p { font-size: 13px; color: var(--admin-text-dim); margin: 0; }
        .page-error {
          background: rgba(226,104,95,0.1); border: 1px solid rgba(226,104,95,0.3); color: var(--admin-danger);
          padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
