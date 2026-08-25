import { useRef, useState } from 'react';
import { uploadPhoto, removeStorageFile } from '../../services/storageService';

export default function PhotoUploader({ ownerId, invitationId, kind, photos, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const multiple = kind === 'gallery';
  const items = photos.filter((p) => p.kind === kind);

  async function handleFiles(fileList) {
    setError('');
    if (!invitationId) {
      setError('Avval invitationni saqlang, keyin rasm yuklang.');
      return;
    }
    const files = Array.from(fileList);
    setUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const { url, path } = await uploadPhoto(file, { ownerId, invitationId, kind });
        onAdd({ url, path, kind });
      }
    } catch (err) {
      setError(err.message || 'Yuklashda xatolik.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove(photo) {
    try {
      await removeStorageFile(photo.storage_path || photo.path);
    } catch {
      // ignore storage errors on delete, still remove reference
    }
    onRemove(photo);
  }

  return (
    <div className="photo-uploader">
      <div className="photo-grid">
        {items.map((p) => (
          <div className="photo-item" key={p.id || p.path}>
            <img src={p.url} alt="" />
            <button type="button" className="photo-remove" onClick={() => handleRemove(p)}>
              O&#8217;chirish
            </button>
          </div>
        ))}

        <label className="photo-add">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => e.target.files.length && handleFiles(e.target.files)}
            hidden
          />
          {uploading ? 'Yuklanmoqda...' : multiple ? '+ Rasm qo\u2018shish' : items.length ? 'Almashtirish' : '+ Rasm yuklash'}
        </label>
      </div>
      {error && <div className="photo-error">{error}</div>}

      <style>{`
        .photo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .photo-item {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--admin-border);
        }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; }
        .photo-remove {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.65);
          color: #fff;
          font-size: 10px;
          padding: 4px 0;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .photo-item:hover .photo-remove { opacity: 1; }
        @media (hover: none) {
          .photo-remove { opacity: 1; }
        }
        .photo-add {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          border: 1.5px dashed var(--admin-border);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 11px;
          color: var(--admin-text-dim);
          padding: 6px;
          cursor: pointer;
        }
        .photo-add:hover { border-color: var(--admin-accent); color: var(--admin-text); }
        .photo-error {
          margin-top: 8px;
          font-size: 12px;
          color: var(--admin-danger);
        }
      `}</style>
    </div>
  );
}
