-- In-app notifications + Expo push token on profiles
-- Safe to run multiple times

alter table public.profiles
  add column if not exists expo_push_token text;

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'system'
    check (type in ('booking', 'reminder', 'promo', 'system')),
  title text not null,
  message text not null,
  read boolean not null default false,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists user_notifications_user_created_idx
  on public.user_notifications (user_id, created_at desc);

alter table public.user_notifications enable row level security;

drop policy if exists "Users read own notifications" on public.user_notifications;
create policy "Users read own notifications"
  on public.user_notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.user_notifications;
create policy "Users update own notifications"
  on public.user_notifications for update
  using (auth.uid() = user_id);
