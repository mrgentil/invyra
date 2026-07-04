import { Category, Event, Organizer, Ticket, User } from "@/types";
import { RDC_LOCATIONS } from "@/constants/rdcLocations";

const RDC_CITY_LOCATIONS = RDC_LOCATIONS.filter((location) => location.id !== "all");

export const categories: Category[] = [
  { id: "cat-1", name: "Musique", icon: "musical-notes", color: "#3B82F6", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", eventCount: 120 },
  { id: "cat-2", name: "Sport", icon: "football", color: "#2ECC71", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400", eventCount: 85 },
  { id: "cat-3", name: "Arts", icon: "color-palette", color: "#FF4D4F", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", eventCount: 64 },
  { id: "cat-4", name: "Food", icon: "restaurant", color: "#FF6B35", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", eventCount: 92 },
  { id: "cat-5", name: "Tech", icon: "laptop", color: "#00B4D8", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400", eventCount: 45 },
  { id: "cat-6", name: "Nuit", icon: "moon", color: "#2563EB", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400", eventCount: 73 },
  { id: "cat-7", name: "Business", icon: "briefcase", color: "#1E1E1E", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", eventCount: 38 },
  { id: "cat-8", name: "Santé", icon: "fitness", color: "#FF6B9D", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", eventCount: 29 },
  { id: "cat-9", name: "Mode", icon: "shirt", color: "#38BDF8", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", eventCount: 41 },
  { id: "cat-10", name: "École", icon: "school", color: "#4CC9F0", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", eventCount: 33 },
  { id: "cat-11", name: "Cinéma", icon: "film", color: "#3B82F6", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", eventCount: 56 },
  { id: "cat-12", name: "Humour", icon: "happy", color: "#2ECC71", image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400", eventCount: 27 },
  { id: "cat-13", name: "Charité", icon: "heart", color: "#FF4D4F", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400", eventCount: 18 },
  { id: "cat-14", name: "Outdoor", icon: "trail-sign", color: "#2ECC71", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400", eventCount: 48 },
  { id: "cat-15", name: "Gaming", icon: "game-controller", color: "#2563EB", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400", eventCount: 35 },
  { id: "cat-16", name: "Photo", icon: "camera", color: "#FF6B35", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400", eventCount: 22 },
  { id: "cat-17", name: "Atelier", icon: "construct", color: "#00B4D8", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400", eventCount: 31 },
  { id: "cat-18", name: "Festival", icon: "flag", color: "#38BDF8", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400", eventCount: 16 },
  { id: "cat-19", name: "Famille", icon: "people", color: "#FF6B9D", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400", eventCount: 24 },
  { id: "cat-20", name: "Voyage", icon: "airplane", color: "#4CC9F0", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400", eventCount: 19 },
];

export const organizers: Organizer[] = [
  { id: "org-1", name: "EventPro Inc.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", email: "contact@eventpro.com", phone: "+33-1-42-00-00-01", bio: "Agence événementielle premium", rating: 4.8, eventCount: 156, followers: 12500, verified: true },
  { id: "org-2", name: "LiveNation", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", email: "info@livenation.com", phone: "+33-1-42-00-00-02", bio: "Divertissement live à l'échelle mondiale", rating: 4.9, eventCount: 342, followers: 89000, verified: true },
  { id: "org-3", name: "TechConf", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", email: "hello@techconf.io", phone: "+33-1-42-00-00-03", bio: "Conférences tech dans le monde entier", rating: 4.7, eventCount: 89, followers: 34000, verified: true },
  { id: "org-4", name: "ArtBeat", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", email: "team@artbeat.com", phone: "+33-1-42-00-00-04", bio: "Relier les artistes à leur public", rating: 4.6, eventCount: 67, followers: 8900, verified: false },
  { id: "org-5", name: "SportsHub", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200", email: "info@shub.com", phone: "+33-1-42-00-00-05", bio: "Votre destination sport ultime", rating: 4.5, eventCount: 123, followers: 56000, verified: true },
  { id: "org-6", name: "FoodFiesta", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", email: "hello@foodfiesta.com", phone: "+33-1-42-00-00-06", bio: "Des expériences culinaires inoubliables", rating: 4.4, eventCount: 45, followers: 12000, verified: false },
  { id: "org-7", name: "NightOwl", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200", email: "party@nightowl.com", phone: "+33-1-42-00-00-07", bio: "Les meilleurs événements nocturnes", rating: 4.3, eventCount: 78, followers: 23000, verified: true },
  { id: "org-8", name: "FitLife", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", email: "info@fitlife.com", phone: "+33-1-42-00-00-08", bio: "Événements santé et bien-être", rating: 4.7, eventCount: 34, followers: 15000, verified: true },
  { id: "org-9", name: "EduLearn", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", email: "contact@edulearn.io", phone: "+33-1-42-00-00-09", bio: "L'apprentissage ne s'arrête jamais", rating: 4.6, eventCount: 56, followers: 7800, verified: false },
  { id: "org-10", name: "GreenField", avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200", email: "nature@greenfield.com", phone: "+33-1-42-00-00-10", bio: "Des aventures en plein air vous attendent", rating: 4.8, eventCount: 29, followers: 9800, verified: true },
];

const eventImages = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800",
  "https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=800",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",
  "https://images.unsplash.com/photo-1496024840928-4c417a1f8e6d?w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
];

const locations = [
  { name: "Palais de la Culture", suffix: "Centre culturel" },
  { name: "Stade des Martyrs", suffix: "Arène sportive" },
  { name: "Maison de la Culture", suffix: "Salle de spectacle" },
  { name: "Centre de Conférences", suffix: "Espace événementiel" },
  { name: "Parc Expo", suffix: "Exposition" },
  { name: "Arena Live", suffix: "Concert live" },
  { name: "Espace VIP Lounge", suffix: "Soirée premium" },
  { name: "Place de la Gare", suffix: "Open air" },
];

function buildRdcVenue(cityLocation: (typeof RDC_CITY_LOCATIONS)[number], templateIndex: number) {
  const template = locations[templateIndex % locations.length];
  return {
    name: `${template.name} ${cityLocation.city}`,
    address: `${cityLocation.city}, ${cityLocation.province}, RDC`,
    latitude: -4.3 + (templateIndex % 8) * 0.4,
    longitude: 15.2 + (templateIndex % 8) * 0.5,
    cityId: cityLocation.id,
    city: cityLocation.city,
    province: cityLocation.province,
  };
}

function applyCityFilter(list: Event[], cityId?: string) {
  if (!cityId || cityId === "all") return list;
  return list.filter((event) => event.location.cityId === cityId);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDays = 7, endDays = 90): string {
  const now = new Date();
  const start = now.getTime() + startDays * 86400000;
  const end = now.getTime() + endDays * 86400000;
  return new Date(start + Math.random() * (end - start)).toISOString();
}

const eventNames = [
  "Festival été", "Summit Tech", "Gala Arts", "Salon Food & Vin",
  "Marathon 2026", "Stand-up Live", "Fashion Week", "Pitch Day",
  "Retraite Yoga", "Avant-première", "Concert Jazz", "Expo Photo",
  "Dégustation Vin", "Battle Danse", "Lancement Livre",
  "Gala Caritatif", "Tournoi Gaming", "Masterclass Cuisine", "Atelier Design",
  "Fest Électro", "Finale Basket", "Street Art Fest", "Fête Bière",
  "Summit Bien-être", "Soirée Théâtre",
];

export const events: Event[] = Array.from({ length: 50 }, (_, i) => {
  const cat = categories[i % categories.length];
  const org = organizers[i % organizers.length];
  const price = [0, 25, 49, 79, 99, 149, 199, 299, 499][Math.floor(Math.random() * 9)];
  const cityLocation = RDC_CITY_LOCATIONS[i % RDC_CITY_LOCATIONS.length];
  const venue = buildRdcVenue(cityLocation, i);
  return {
    id: `event-${i + 1}`,
    title: eventNames[i % eventNames.length],
    description: "Performances, cuisine et networking au rendez-vous. Une soirée unique à ne pas manquer.",
    shortDescription: "À ne pas manquer !",
    images: [eventImages[i % eventImages.length], eventImages[(i + 1) % eventImages.length], eventImages[(i + 2) % eventImages.length]],
    category: cat,
    organizer: org,
    date: randomDate(),
    time: "20h00",
    endDate: randomDate(8, 91),
    endTime: "23h00",
    location: {
      id: `loc-${i}`,
      name: venue.name,
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
      cityId: venue.cityId,
      city: venue.city,
      province: venue.province,
      distance: Math.floor(Math.random() * 50),
    },
    price,
    originalPrice: price > 0 ? price + Math.floor(Math.random() * 100) : undefined,
    currency: "USD",
    capacity: Math.floor(Math.random() * 5000) + 100,
    attendees: Math.floor(Math.random() * 5000),
    rating: +(3.5 + Math.random() * 1.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500),
    tags: [cat.name.toLowerCase(), "populaire", "tendance"].slice(0, Math.floor(Math.random() * 3) + 1),
    featured: Math.random() > 0.7,
    trending: Math.random() > 0.6,
    status: Math.random() > 0.8 ? "ongoing" : "upcoming",
  };
});

export const tickets: Ticket[] = Array.from({ length: 10 }, (_, i) => {
  const event = events[i];
  return {
    id: `ticket-${i + 1}`,
    eventId: event.id,
    event,
    type: ["vip", "standard", "early-bird"][i % 3] as Ticket["type"],
    quantity: Math.floor(Math.random() * 4) + 1,
    price: event.price,
    totalAmount: event.price * (Math.floor(Math.random() * 4) + 1),
    status: (["active", "active", "active", "active", "used", "used", "expired", "active", "active", "used"] as Ticket["status"][])[i],
    purchaseDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    qrCode: `qr-${i}-${Date.now()}`,
    barcode: `bc-${i}-${Date.now()}`,
  };
});

export const users: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: i === 0 ? "Marie Dubois" : `Utilisateur ${i + 1}`,
  email: i === 0 ? "marie.dubois@exemple.com" : `utilisateur${i + 1}@exemple.com`,
  phone: `+33-6-${String(10000000 + i).slice(1)}`,
  avatar: `https://images.unsplash.com/photo-${[1472099645785, 1500648767791, 1438761681033, 1506794778202, 1534528741775, 1504257432389, 1494790108377, 1544005313, 1509967419530, 1531746020798][i % 10]}?w=200`,
  location: i === 0 ? "Kinshasa, Kinshasa" : randomItem(RDC_CITY_LOCATIONS).label,
  preferences: [categories[i % categories.length].name],
  tickets: [],
  favorites: [],
  notifications: [],
}));

export function getEvents(params?: { category?: string; search?: string; page?: number; cityId?: string }): Event[] {
  let filtered = [...events];
  filtered = applyCityFilter(filtered, params?.cityId);
  if (params?.category) {
    filtered = filtered.filter((e) => e.category.id === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.name.toLowerCase().includes(q) ||
        e.location.city?.toLowerCase().includes(q) ||
        e.location.province?.toLowerCase().includes(q)
    );
  }
  const page = params?.page || 1;
  const start = (page - 1) * 20;
  return filtered.slice(start, start + 20);
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export function getFeaturedEvents(cityId?: string): Event[] {
  return applyCityFilter(events.filter((e) => e.featured), cityId).slice(0, 5);
}

export function getTrendingEvents(cityId?: string): Event[] {
  return applyCityFilter(events.filter((e) => e.trending), cityId).slice(0, 10);
}

export function getUpcomingEvents(cityId?: string): Event[] {
  return applyCityFilter(events, cityId).slice(0, 10);
}

export function getNearbyEvents(cityId?: string): Event[] {
  return applyCityFilter([...events], cityId)
    .sort((a, b) => (a.location.distance || 99) - (b.location.distance || 99))
    .slice(0, 8);
}

export function getPopularEvents(cityId?: string): Event[] {
  return applyCityFilter([...events], cityId)
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, 10);
}

export function getUserTickets(): Ticket[] {
  return tickets;
}
