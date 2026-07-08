-- Autorise l'upload des avatars dans Supabase Storage (bucket: avatars)
-- À exécuter dans Supabase Dashboard → SQL Editor

-- RLS est activé par défaut sur storage.objects, mais on le force au cas où
alter table storage.objects enable row level security;

-- Nettoyage (pour pouvoir rejouer le script)
drop policy if exists "Public read avatars" on storage.objects;
drop policy if exists "Users upload own avatar" on storage.objects;
drop policy if exists "Users update own avatar" on storage.objects;
drop policy if exists "Users delete own avatar" on storage.objects;

-- Lecture publique (utile avec getPublicUrl)
create policy "Public read avatars"
on storage.objects
for select
using (bucket_id = 'avatars');

-- Upload: chaque user ne peut écrire que dans son dossier: <uid>/<file>
create policy "Users upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- Update (si upsert remplace un fichier existant)
create policy "Users update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- Delete (optionnel mais propre)
create policy "Users delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

