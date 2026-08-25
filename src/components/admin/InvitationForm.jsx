import { useEffect, useState } from 'react';
import { useRef } from 'react';
import DesignSelector from './DesignSelector.jsx';
import PhotoUploader from './PhotoUploader.jsx';
import { InvitationRenderer } from '../../themes/index.jsx';
import { slugify, isValidSlug } from '../../lib/utils';
import { checkSlugAvailable } from '../../services/invitationService';
import { uploadMusic, removeStorageFile } from '../../services/storageService';

const EMPTY = {
  bride_name: '',
  groom_name: '',
  wedding_date: '',
  wedding_time: '',
  venue_name: '',
  venue_address: '',
  maps_link: '',
  invitation_text: 'Bizning baxtli kunimizga sizni taklif qilamiz.',
  contact_name: '',
  contact_phone: '',
  slug: '',
  design: 'dark',
  status: 'draft',
  music_url: '',
  music_storage_path: '',
};

export default function InvitationForm({
  mode,
  ownerId,
  invitation,
  photos = [],
  onSave,
  onAddPhoto,
  onRemovePhoto,
  saving,
}) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...invitation }));
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [slugError, setSlugError] = useState('');
  const [musicUploading, setMusicUploading] = useState(false);
  const musicInputRef = useRef(null);

  useEffect(() => {
    if (invitation) setForm((prev) => ({ ...prev, ...invitation }));
  }, [invitation]);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'bride_name' || field === 'groom_name') {
        if (!slugTouched) {
          next.slug = slugify(`${next.bride_name}-va-${next.groom_name}`);
        }
      }
      return next;
    });
  }

  async function validateSlug() {
    if (!form.slug) {
      setSlugError('Slug majburiy.');
      return false;
    }
    if (!isValidSlug(form.slug)) {
      setSlugError('Slug faqat lotin harflar, raqam va tire (-) dan iborat bo\u2018lishi kerak.');
      return false;
    }
    const available = await checkSlugAvailable(form.slug, invitation?.id);
    if (!available) {
      setSlugError('Bu slug band. Boshqasini tanlang.');
      return false;
    }
    setSlugError('');
    return true;
  }

  async function handleSubmit(e, publish) {
    e.preventDefault();
    const slugOk = await validateSlug();
    if (!slugOk) return;
    const payload = { ...form, status: publish ? 'published' : form.status };
    await onSave(payload);
  }

  async function handleMusicFile(file) {
    if (!invitation?.id) return;
    setMusicUploading(true);
    try {
      if (form.music_storage_path) {
        await removeStorageFile(form.music_storage_path).catch(() => {});
      }
      const { url, path } = await uploadMusic(file, { ownerId, invitationId: invitation.id });
      update('music_url', url);
      update('music_storage_path', path);
    } catch (err) {
      alert(err.message || 'Musiqa yuklashda xatolik.');
    } finally {
      setMusicUploading(false);
      if (musicInputRef.current) musicInputRef.current.value = '';
    }
  }

  const previewData = { ...form, photos, id: invitation?.id };

  return (
    <div className="inv-form-layout">
      <form className="inv-form" onSubmit={(e) => handleSubmit(e, false)}>
        <section className="form-block">
          <h3>Juftlik</h3>
          <div className="form-row">
            <label>
              <span>Kelin ismi</span>
              <input value={form.bride_name} onChange={(e) => update('bride_name', e.target.value)} required />
            </label>
            <label>
              <span>Kuyov ismi</span>
              <input value={form.groom_name} onChange={(e) => update('groom_name', e.target.value)} required />
            </label>
          </div>
        </section>

        <section className="form-block">
          <h3>To&#8217;y ma&#8217;lumotlari</h3>
          <div className="form-row">
            <label>
              <span>Sana</span>
              <input type="date" value={form.wedding_date} onChange={(e) => update('wedding_date', e.target.value)} required />
            </label>
            <label>
              <span>Vaqt</span>
              <input type="time" value={form.wedding_time} onChange={(e) => update('wedding_time', e.target.value)} />
            </label>
          </div>
          <label>
            <span>To&#8217;yxona nomi</span>
            <input value={form.venue_name} onChange={(e) => update('venue_name', e.target.value)} />
          </label>
          <label>
            <span>To&#8217;liq manzil</span>
            <input value={form.venue_address} onChange={(e) => update('venue_address', e.target.value)} />
          </label>
          <label>
            <span>Google Maps havolasi</span>
            <input value={form.maps_link} onChange={(e) => update('maps_link', e.target.value)} placeholder="https://maps.google.com/..." />
          </label>
        </section>

        <section className="form-block">
          <h3>Matn</h3>
          <label>
            <span>Taklifnoma matni</span>
            <textarea rows={3} value={form.invitation_text} onChange={(e) => update('invitation_text', e.target.value)} />
          </label>
        </section>

        <section className="form-block">
          <h3>Aloqa</h3>
          <div className="form-row">
            <label>
              <span>Ism</span>
              <input value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} />
            </label>
            <label>
              <span>Telefon</span>
              <input value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} />
            </label>
          </div>
        </section>

        <section className="form-block">
          <h3>Dizayn</h3>
          <DesignSelector value={form.design} onChange={(v) => update('design', v)} />
        </section>

        <section className="form-block">
          <h3>Slug (public URL)</h3>
          <label>
            <span>/{form.slug || 'slug'}</span>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update('slug', slugify(e.target.value));
              }}
              onBlur={validateSlug}
              required
            />
          </label>
          {slugError && <div className="form-error">{slugError}</div>}
        </section>

        {invitation?.id ? (
          <>
            <section className="form-block">
              <h3>Rasmlar</h3>
              <div className="form-photo-group">
                <span className="form-photo-label">Hero (asosiy) rasm</span>
                <PhotoUploader
                  ownerId={ownerId}
                  invitationId={invitation.id}
                  kind="hero"
                  photos={photos}
                  onAdd={onAddPhoto}
                  onRemove={onRemovePhoto}
                />
              </div>
              <div className="form-photo-group">
                <span className="form-photo-label">Gallery rasmlar</span>
                <PhotoUploader
                  ownerId={ownerId}
                  invitationId={invitation.id}
                  kind="gallery"
                  photos={photos}
                  onAdd={onAddPhoto}
                  onRemove={onRemovePhoto}
                />
              </div>
            </section>

            <section className="form-block">
              <h3>Musiqa (ixtiyoriy)</h3>
              <label>
                <span>Musiqa URL</span>
                <input value={form.music_url} onChange={(e) => update('music_url', e.target.value)} placeholder="https://..." />
              </label>
              <div className="form-music-upload">
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files[0] && handleMusicFile(e.target.files[0])}
                  hidden
                  id="music-file"
                />
                <label htmlFor="music-file" className="form-music-btn">
                  {musicUploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
                </label>
                {form.music_url && <span className="form-music-current">Musiqa biriktirilgan</span>}
              </div>
            </section>
          </>
        ) : (
          <div className="form-hint">
            Rasm va musiqa yuklash uchun avval &#8220;Saqlash&#8221; tugmasini bosing.
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-secondary" disabled={saving}>
            {saving ? 'Saqlanmoqda...' : 'Qoralama sifatida saqlash'}
          </button>
          <button type="button" className="btn-primary" disabled={saving} onClick={(e) => handleSubmit(e, true)}>
            {saving ? 'Saqlanmoqda...' : 'Saqlash va nashr qilish'}
          </button>
        </div>
      </form>

      <div className="inv-preview">
        <div className="inv-preview-label">Live Preview</div>
        <div className="inv-preview-phone">
          <div className="inv-preview-screen">
            <InvitationRenderer data={previewData} previewMode />
          </div>
        </div>
      </div>

      <style>{`
        .inv-form-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: flex-start;
        }
        .inv-form {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .form-block { display: flex; flex-direction: column; gap: 14px; }
        .form-block h3 {
          margin: 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--admin-accent); font-weight: 600;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        label { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--admin-text-dim); }
        input, textarea {
          background: var(--admin-surface-2); border: 1px solid var(--admin-border); border-radius: 8px;
          padding: 11px 13px; color: var(--admin-text); font-size: 13.5px; outline: none; resize: vertical;
        }
        input:focus, textarea:focus { border-color: var(--admin-accent); }
        .form-error { font-size: 12px; color: var(--admin-danger); }
        .form-hint { font-size: 13px; color: var(--admin-text-dim); background: var(--admin-surface-2); padding: 14px; border-radius: 8px; }
        .form-photo-group { display: flex; flex-direction: column; gap: 10px; }
        .form-photo-label { font-size: 12px; color: var(--admin-text-dim); }
        .form-music-upload { display: flex; align-items: center; gap: 14px; }
        .form-music-btn {
          background: var(--admin-surface-2); border: 1px solid var(--admin-border); border-radius: 8px;
          padding: 9px 16px; font-size: 12.5px; cursor: pointer; color: var(--admin-text);
        }
        .form-music-current { font-size: 12px; color: var(--admin-success); }
        .form-actions { display: flex; gap: 12px; padding-top: 8px; border-top: 1px solid var(--admin-border); }
        .btn-primary, .btn-secondary {
          padding: 12px 22px; border-radius: 8px; font-size: 13.5px; font-weight: 600; border: none;
        }
        .btn-primary { background: var(--admin-accent); color: #14161b; }
        .btn-secondary { background: transparent; border: 1px solid var(--admin-border); color: var(--admin-text-dim); }
        .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.6; cursor: default; }

        .inv-preview { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 12px; align-items: center; }
        .inv-preview-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--admin-text-dim); }
        .inv-preview-phone {
          width: 340px; height: 700px; border-radius: 40px; background: #05060a;
          padding: 14px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .inv-preview-screen {
          width: 100%; height: 100%; border-radius: 28px; overflow-y: auto; background: #000;
        }
        @media (max-width: 1100px) {
          .inv-form-layout { grid-template-columns: 1fr; }
          .inv-preview { position: static; }
          .inv-preview-phone { width: 100%; max-width: 340px; }
        }
        @media (max-width: 560px) {
          .inv-form { padding: 18px; gap: 22px; }
          .form-row { grid-template-columns: 1fr; }
          .form-actions { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; text-align: center; }
        }
      `}</style>
    </div>
  );
}
