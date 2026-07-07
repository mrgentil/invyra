-- Invyra — schéma initial Supabase
-- Exécuter dans : Supabase Dashboard → SQL Editor

-- ─── Tables ───────────────────────────────────────────────────────────────

create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null default 'calendar',
  color text not null default '#3B82F6',
  image_url text,
  event_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.organizers (
  id text primary key,
  name text not null,
  avatar_url text,
  email text,
  phone text,
  bio text,
  rating numeric(2,1) not null default 0,
  event_count int not null default 0,
  followers int not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  short_description text,
  images text[] not null default '{}',
  category_id text not null references public.categories(id),
  organizer_id text not null references public.organizers(id),
  event_date timestamptz not null,
  time_label text not null default '20h00',
  end_date timestamptz,
  end_time_label text,
  location_name text not null,
  location_address text not null,
  latitude double precision not null default 0,
  longitude double precision not null default 0,
  city_id text not null,
  city text not null,
  province text not null,
  distance_km int,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  currency text not null default 'USD',
  capacity int not null default 100,
  attendees int not null default 0,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  tags text[] not null default '{}',
  featured boolean not null default false,
  trending boolean not null default false,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  avatar_url text,
  city_id text,
  city_label text,
  preferences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_id uuid not null references public.events(id),
  guest_name text,
  guest_email text,
  guest_phone text,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  service_fee numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  event_id uuid not null references public.events(id),
  ticket_type text not null default 'standard'
    check (ticket_type in ('vip', 'standard', 'early-bird')),
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  status text not null default 'active'
    check (status in ('active', 'used', 'expired', 'cancelled')),
  qr_code text not null,
  barcode text not null,
  purchase_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  amount numeric(10,2) not null,
  method text not null,
  provider text,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────

create index if not exists events_city_id_idx on public.events (city_id);
create index if not exists events_category_id_idx on public.events (category_id);
create index if not exists events_featured_idx on public.events (featured) where featured = true;
create index if not exists events_trending_idx on public.events (trending) where trending = true;
create index if not exists events_event_date_idx on public.events (event_date);
create index if not exists tickets_user_id_idx on public.tickets (user_id);

-- ─── RLS ───────────────────────────────────────────────────────────────────

alter table public.categories enable row level security;
alter table public.organizers enable row level security;
alter table public.events enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;
alter table public.tickets enable row level security;
alter table public.payments enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read organizers" on public.organizers for select using (true);
create policy "Public read events" on public.events for select using (true);

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users manage own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own bookings" on public.bookings
  for select using (auth.uid() = user_id);
create policy "Users create bookings" on public.bookings
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users read own tickets" on public.tickets
  for select using (auth.uid() = user_id);
create policy "Users create tickets" on public.tickets
  for insert with check (auth.uid() = user_id);

create policy "Users read own payments" on public.payments
  for select using (auth.uid() = user_id);

-- ─── Auth trigger ─────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Updated at ───────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
