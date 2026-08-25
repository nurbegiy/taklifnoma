import { supabase } from '../lib/supabaseClient';

const BUCKET = 'wedding-photos';

export async function uploadPhoto(file, { ownerId, invitationId, kind }) {
  const ext = file.name.split('.').pop();
  const safeKind = kind || 'gallery';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = `${ownerId}/${invitationId}/${safeKind}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function uploadMusic(file, { ownerId, invitationId }) {
  const ext = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = `${ownerId}/${invitationId}/music/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function removeStorageFile(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
