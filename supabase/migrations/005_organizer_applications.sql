-- Organizer applications (mobile) + link organizers to users
-- Safe to run multiple times

alter table public.organizers
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists organizers_user_id_unique
  on public.organizers (user_id)
  where user_id is not null;

create table if not exists public.organizer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  email text,
  phone text,
  city text,
  bio text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  organizer_id text references public.organizers(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organizer_applications_pending_unique
  on public.organizer_applications (user_id)
  where status = 'pending';

create index if not exists organizer_applications_status_idx
  on public.organizer_applications (status, created_at desc);

alter table public.organizer_applications enable row level security;

drop policy if exists "Users read own organizer applications" on public.organizer_applications;
create policy "Users read own organizer applications"
  on public.organizer_applications for select
  using (auth.uid() = user_id);

drop trigger if exists organizer_applications_updated_at on public.organizer_applications;
create trigger organizer_applications_updated_at
  before update on public.organizer_applications
  for each row execute procedure public.set_updated_at();
