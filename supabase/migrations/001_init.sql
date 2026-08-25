-- ============================================================
-- Taklifnoma — initial schema, RLS policies, storage policies
-- Run this in Supabase SQL editor (or via CLI migrations).
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  design text not null default 'dark' check (design in ('dark', 'warm', 'light')),
  bride_name text not null default '',
  groom_name text not null default '',
  wedding_date date,
  wedding_time time,
  venue_name text,
  venue_address text,
  maps_link text,
  invitation_text text,
  contact_name text,
  contact_phone text,
  music_url text,
  music_storage_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_photos (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  url text not null,
  storage_path text not null,
  kind text not null check (kind in ('hero', 'gallery')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  attending boolean not null default true,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_invitations_owner on public.invitations(owner_id);
create index if not exists idx_invitations_slug on public.invitations(slug);
create index if not exists idx_photos_invitation on public.invitation_photos(invitation_id);
create index if not exists idx_rsvps_invitation on public.invitation_rsvps(invitation_id);

-- ------------------------------------------------------------
-- updated_at auto-touch
-- ------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_invitations_updated_at on public.invitations;
create trigger trg_invitations_updated_at
  before update on public.invitations
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.invitations enable row level security;
alter table public.invitation_photos enable row level security;
alter table public.invitation_rsvps enable row level security;

-- invitations: owner has full access
create policy "Owner can manage own invitations"
  on public.invitations for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- invitations: anyone (anon) can read published invitations
create policy "Public can read published invitations"
  on public.invitations for select
  using (status = 'published');

-- invitation_photos: owner can manage photos of own invitations
create policy "Owner can manage own photos"
  on public.invitation_photos for all
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_photos.invitation_id
      and i.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_photos.invitation_id
      and i.owner_id = auth.uid()
    )
  );

-- invitation_photos: public can read photos of published invitations
create policy "Public can read photos of published invitations"
  on public.invitation_photos for select
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_photos.invitation_id
      and i.status = 'published'
    )
  );

-- invitation_rsvps: owner can read rsvps for own invitations
create policy "Owner can read own rsvps"
  on public.invitation_rsvps for select
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_rsvps.invitation_id
      and i.owner_id = auth.uid()
    )
  );

-- invitation_rsvps: anyone can submit an rsvp to a published invitation
create policy "Public can submit rsvp to published invitations"
  on public.invitation_rsvps for insert
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_rsvps.invitation_id
      and i.status = 'published'
    )
  );

-- ------------------------------------------------------------
-- Storage bucket + policies
-- Bucket layout: wedding-photos/{owner_id}/{invitation_id}/{hero|gallery|music}/{file}
-- Create the bucket as PUBLIC (read) via Dashboard > Storage, or run:
--   insert into storage.buckets (id, name, public) values ('wedding-photos','wedding-photos', true)
--   on conflict (id) do nothing;
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

create policy "Public can view wedding photos"
  on storage.objects for select
  using (bucket_id = 'wedding-photos');

create policy "Owner can upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'wedding-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner can update own files"
  on storage.objects for update
  using (
    bucket_id = 'wedding-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'wedding-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
