import { supabase } from '../lib/supabaseClient';

const TABLE = 'invitations';
const PHOTOS_TABLE = 'invitation_photos';
const RSVP_TABLE = 'invitation_rsvps';

export async function listInvitations(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, invitation_photos(*)')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getInvitationById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, invitation_photos(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getInvitationBySlug(slug) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, invitation_photos(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) return { data: null, error };
  return { data, error: null };
}

export async function checkSlugAvailable(slug, excludeId = null) {
  let query = supabase.from(TABLE).select('id').eq('slug', slug);
  if (excludeId) query = query.neq('id', excludeId);
  const { data, error } = await query.maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return !data;
}

export async function createInvitation(payload, ownerId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...payload, owner_id: ownerId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInvitation(id, payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteInvitation(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function addPhoto(invitationId, { url, path, kind, position }) {
  const { data, error } = await supabase
    .from(PHOTOS_TABLE)
    .insert([{ invitation_id: invitationId, url, storage_path: path, kind, position }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(photoId) {
  const { error } = await supabase.from(PHOTOS_TABLE).delete().eq('id', photoId);
  if (error) throw error;
}

export async function submitRsvp(invitationId, { guestName, guestPhone, attending, message }) {
  const { error } = await supabase.from(RSVP_TABLE).insert([
    {
      invitation_id: invitationId,
      guest_name: guestName,
      guest_phone: guestPhone,
      attending,
      message,
    },
  ]);
  if (error) throw error;
}

export async function listRsvps(invitationId) {
  const { data, error } = await supabase
    .from(RSVP_TABLE)
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
