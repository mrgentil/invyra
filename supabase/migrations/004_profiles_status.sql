-- User account status for admin moderation
-- Safe to run multiple times

alter table public.profiles
  add column if not exists status text not null default 'active';

alter table public.profiles
  drop constraint if exists profiles_status_check;

alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'suspended'));

update public.profiles
set status = 'active'
where status is null or status = '';

create index if not exists profiles_status_idx on public.profiles (status);
