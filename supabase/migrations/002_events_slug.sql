-- Add slug field for events (SEO-friendly identifier)
-- Safe to run multiple times

alter table public.events
  add column if not exists slug text;

-- Best-effort backfill for existing rows (ASCII-only-ish)
update public.events
set slug = lower(trim(both '-' from regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null or slug = '';

create unique index if not exists events_slug_unique on public.events (slug)
where slug is not null and slug <> '';

