import { Category, Event, Organizer, Ticket, User } from "@/types";
import { CategoryRow, EventWithRelations, OrganizerRow, ProfileRow, TicketWithEvent } from "@/types/database";

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    image: row.image_url ?? "",
    eventCount: row.event_count,
  };
}

export function mapOrganizer(row: OrganizerRow): Organizer {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar_url ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    bio: row.bio ?? "",
    rating: Number(row.rating),
    eventCount: row.event_count,
    followers: row.followers,
    verified: row.verified,
  };
}

export function mapEvent(row: EventWithRelations): Event {
  const category = row.categories ? mapCategory(row.categories) : {
    id: row.category_id,
    name: "Événement",
    icon: "calendar",
    color: "#3B82F6",
    image: "",
    eventCount: 0,
  };

  const organizer = row.organizers ? mapOrganizer(row.organizers) : {
    id: row.organizer_id,
    name: "Organisateur",
    avatar: "",
    email: "",
    phone: "",
    bio: "",
    rating: 0,
    eventCount: 0,
    followers: 0,
    verified: false,
  };

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description ?? "",
    images: row.images ?? [],
    category,
    organizer,
    date: row.event_date,
    time: row.time_label,
    endDate: row.end_date ?? row.event_date,
    endTime: row.end_time_label ?? row.time_label,
    location: {
      id: `loc-${row.id}`,
      name: row.location_name,
      address: row.location_address,
      latitude: row.latitude,
      longitude: row.longitude,
      cityId: row.city_id,
      city: row.city,
      province: row.province,
      distance: row.distance_km ?? undefined,
    },
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    currency: row.currency,
    capacity: row.capacity,
    attendees: row.attendees,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tags: row.tags ?? [],
    featured: row.featured,
    trending: row.trending,
    status: row.status,
  };
}

export function mapTicket(row: TicketWithEvent): Ticket | null {
  if (!row.events) return null;

  return {
    id: row.id,
    eventId: row.event_id,
    event: mapEvent(row.events),
    type: row.ticket_type,
    quantity: row.quantity,
    price: Number(row.unit_price),
    totalAmount: Number(row.total_amount),
    status: row.status,
    purchaseDate: row.purchase_date,
    qrCode: row.qr_code,
    barcode: row.barcode,
  };
}

export function mapProfile(row: ProfileRow, email: string): User {
  return {
    id: row.id,
    name: row.name ?? email.split("@")[0],
    email,
    phone: row.phone ?? "",
    avatar: row.avatar_url ?? "",
    location: row.city_label ?? undefined,
    preferences: row.preferences ?? [],
    tickets: [],
    favorites: [],
    notifications: [],
  };
}
