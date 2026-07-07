-- Invyra — données de démo (après 001_initial_schema.sql)

insert into public.categories (id, name, icon, color, image_url, event_count) values
  ('cat-1', 'Musique', 'musical-notes', '#3B82F6', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', 120),
  ('cat-2', 'Sport', 'football', '#2ECC71', 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400', 85),
  ('cat-3', 'Arts', 'color-palette', '#FF4D4F', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', 64),
  ('cat-4', 'Food', 'restaurant', '#FF6B35', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', 92),
  ('cat-5', 'Tech', 'laptop', '#00B4D8', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', 45),
  ('cat-6', 'Nuit', 'moon', '#2563EB', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 73)
on conflict (id) do nothing;

insert into public.organizers (id, name, avatar_url, email, phone, bio, rating, event_count, followers, verified) values
  ('org-1', 'EventPro RDC', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', 'contact@eventpro.cd', '+243-81-000-0001', 'Agence événementielle premium en RDC', 4.8, 156, 12500, true),
  ('org-2', 'LiveNation Kin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'info@livenation.cd', '+243-81-000-0002', 'Divertissement live à Kinshasa', 4.9, 342, 89000, true),
  ('org-3', 'TechConf Africa', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 'hello@techconf.io', '+243-81-000-0003', 'Conférences tech en Afrique centrale', 4.7, 89, 34000, true),
  ('org-4', 'ArtBeat', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 'team@artbeat.cd', '+243-81-000-0004', 'Relier les artistes à leur public', 4.6, 67, 8900, false),
  ('org-5', 'NightOwl', 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200', 'party@nightowl.cd', '+243-81-000-0005', 'Les meilleurs événements nocturnes', 4.3, 78, 23000, true)
on conflict (id) do nothing;

insert into public.events (
  id, title, description, short_description, images,
  category_id, organizer_id, event_date, time_label, end_date, end_time_label,
  location_name, location_address, latitude, longitude,
  city_id, city, province, distance_km,
  price, original_price, currency, capacity, attendees,
  rating, review_count, tags, featured, trending, status
) values
(
  'a0000001-0000-4000-8000-000000000001',
  'Festival été Kinshasa',
  'Performances, cuisine et networking au rendez-vous. Une soirée unique à ne pas manquer.',
  'À ne pas manquer !',
  array['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800','https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'],
  'cat-1', 'org-1', now() + interval '12 days', '20h00', now() + interval '12 days', '23h00',
  'Palais de la Culture Kinshasa', 'Kinshasa, Kinshasa, RDC', -4.3217, 15.3125,
  'kinshasa', 'Kinshasa', 'Kinshasa', 3,
  49, 79, 'USD', 2500, 1800, 4.8, 320, array['musique','populaire'], true, true, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000002',
  'Summit Tech Lubumbashi',
  'Innovation, startups et networking pour la tech congolaise.',
  'Le rendez-vous tech du Katanga',
  array['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
  'cat-5', 'org-3', now() + interval '20 days', '09h00', now() + interval '20 days', '18h00',
  'Centre de Conférences Lubumbashi', 'Lubumbashi, Haut-Katanga, RDC', -11.6647, 27.4794,
  'lubumbashi', 'Lubumbashi', 'Haut-Katanga', 8,
  99, 149, 'USD', 800, 420, 4.7, 180, array['tech','business'], true, false, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000003',
  'Gala Arts Goma',
  'Exposition, performances live et rencontres artistiques.',
  'Soirée culturelle premium',
  array['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
  'cat-3', 'org-4', now() + interval '8 days', '19h00', now() + interval '8 days', '22h30',
  'Maison de la Culture Goma', 'Goma, Nord-Kivu, RDC', -1.6785, 29.2295,
  'goma', 'Goma', 'Nord-Kivu', 5,
  25, 45, 'USD', 600, 310, 4.6, 95, array['arts'], false, true, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000004',
  'Salon Food & Vin Bukavu',
  'Dégustations, chefs locaux et musique live au bord du lac.',
  'Gastronomie et ambiance',
  array['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
  'cat-4', 'org-1', now() + interval '15 days', '18h00', now() + interval '15 days', '23h00',
  'Parc Expo Bukavu', 'Bukavu, Sud-Kivu, RDC', -2.5086, 28.8408,
  'bukavu', 'Bukavu', 'Sud-Kivu', 12,
  0, null, 'USD', 1200, 890, 4.5, 210, array['food','gratuit'], true, true, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000005',
  'Marathon 2026 Kisangani',
  'Course urbaine, village sportif et animations toute la journée.',
  'Sport et communauté',
  array['https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800'],
  'cat-2', 'org-5', now() + interval '30 days', '07h00', now() + interval '30 days', '14h00',
  'Stade des Martyrs Kisangani', 'Kisangani, Tshopo, RDC', 0.5153, 25.1910,
  'kisangani', 'Kisangani', 'Tshopo', 18,
  15, 25, 'USD', 3000, 1200, 4.4, 88, array['sport'], false, false, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000006',
  'Soirée Électro NightOwl',
  'DJ sets internationaux et expérience immersive nocturne.',
  'La nuit électro de Kinshasa',
  array['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'],
  'cat-6', 'org-5', now() + interval '5 days', '22h00', now() + interval '6 days', '04h00',
  'Espace VIP Lounge Kinshasa', 'Kinshasa, Kinshasa, RDC', -4.3250, 15.3222,
  'kinshasa', 'Kinshasa', 'Kinshasa', 2,
  79, 99, 'USD', 1500, 1100, 4.9, 450, array['nuit','tendance'], true, true, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000007',
  'Stand-up Live Matadi',
  'Humour, scène ouverte et invités spéciaux.',
  'Rires garantis',
  array['https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800'],
  'cat-1', 'org-2', now() + interval '18 days', '20h30', now() + interval '18 days', '23h00',
  'Arena Live Matadi', 'Matadi, Kongo Central, RDC', -5.8167, 13.4500,
  'matadi', 'Matadi', 'Kongo Central', 22,
  35, 50, 'USD', 400, 280, 4.3, 67, array['humour'], false, false, 'upcoming'
),
(
  'a0000001-0000-4000-8000-000000000008',
  'Concert Jazz Mbuji-Mayi',
  'Soirée jazz avec artistes locaux et internationaux.',
  'Ambiance feutrée',
  array['https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'],
  'cat-1', 'org-4', now() + interval '25 days', '20h00', now() + interval '25 days', '23h30',
  'Maison de la Culture Mbuji-Mayi', 'Mbuji-Mayi, Kasaï Oriental, RDC', -6.1360, 23.5898,
  'mbuji-mayi', 'Mbuji-Mayi', 'Kasaï Oriental', 28,
  55, 75, 'USD', 700, 390, 4.7, 112, array['musique','jazz'], false, true, 'upcoming'
)
on conflict (id) do nothing;
