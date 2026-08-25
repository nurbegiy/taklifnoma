import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import InvitationForm from '../components/admin/InvitationForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import {
  getInvitationById,
  updateInvitation,
  addPhoto,
  deletePhoto,
} from '../services/invitationService';

export default function EditInvitation() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  async function load() {
    setError('');
    try {
      const data = await getInvitationById(id);
      setInvitation(data);
      setPhotos(data.invitation_photos || []);
    } catch (err) {
      setError(err.message || 'Topilmadi.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(payload) {
    setSaving(true);
    setSavedMsg('');
    try {
      const updated = await updateInvitation(id, payload);
      setInvitation((prev) => ({ ...prev, ...updated }));
      setSavedMsg('Saqlandi.');
      setTimeout(() => setSavedMsg(''), 2500);
    } catch (err) {
      alert(err.message || 'Saqlashda xatolik.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPhoto({ url, path, kind }) {
    try {
      const position = photos.filter((p) => p.kind === kind).length;
      const photo = await addPhoto(id, { url, path, kind, position });
      setPhotos((prev) => [...prev, photo]);
    } catch (err) {
      alert(err.message || 'Rasm saqlashda xatolik.');
    }
  }

  async function handleRemovePhoto(photo) {
    try {
      if (photo.id) await deletePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p !== photo && p.id !== photo.id));
    } catch (err) {
      alert(err.message || 'Rasmni o\u2018chirishda xatolik.');
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!invitation) return <LoadingSpinner fullScreen={false} label="Yuklanmoqda..." />;

  return (
    <div className="edit-page">
      <div className="page-header">
        <div>
          <h1>{invitation.bride_name} &amp; {invitation.groom_name}</h1>
          <a className="page-link" href={`/${invitation.slug}`} target="_blank" rel="noreferrer">
            toygataklifnoma.vercel.app/{invitation.slug}
          </a>
        </div>
        <div className="page-header-actions">
          {savedMsg && <span className="page-saved">{savedMsg}</span>}
          <button className="btn-ghost" onClick={() => navigate('/admin')}>&larr; Ortga</button>
        </div>
      </div>

      <InvitationForm
        mode="edit"
        ownerId={user.id}
        invitation={invitation}
        photos={photos}
        onSave={handleSave}
        onAddPhoto={handleAddPhoto}
        onRemovePhoto={handleRemovePhoto}
        saving={saving}
      />

      <style>{`
        .edit-page { width: 100%; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-header h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin: 0 0 4px; color: var(--admin-text); }
        .page-link { font-size: 12.5px; color: var(--admin-accent); }
        .page-header-actions { display: flex; align-items: center; gap: 14px; }
        .page-saved { font-size: 12.5px; color: var(--admin-success); }
        .btn-ghost { background: transparent; border: 1px solid var(--admin-border); color: var(--admin-text-dim); padding: 9px 16px; border-radius: 8px; font-size: 12.5px; }
      `}</style>
    </div>
  );
}
