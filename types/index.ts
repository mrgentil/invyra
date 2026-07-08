export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  eventCount: number;
}

export interface Organizer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  eventCount: number;
  followers: number;
  verified: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: Category;
  organizer: Organizer;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  location: Location;
  price: number;
  originalPrice?: number;
  currency: string;
  capacity: number;
  attendees: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  cityId?: string;
  city?: string;
  province?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  event: Event;
  type: "vip" | "standard" | "early-bird";
  quantity: number;
  price: number;
  totalAmount: number;
  status: "active" | "used" | "expired" | "cancelled";
  purchaseDate: string;
  qrCode: string;
  barcode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  location?: string;
  cityId?: string;
  preferences: string[];
  tickets: Ticket[];
  favorites: string[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: "booking" | "reminder" | "promo" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface Review {
  id: string;
  user: Pick<User, "id" | "name" | "avatar">;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookingInfo {
  eventId: string;
  ticketType: "vip" | "standard" | "early-bird";
  quantity: number;
  totalAmount: number;
  personalInfo: PersonalInfo;
  paymentMethod: PaymentMethod;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface PaymentMethod {
  type: "paypal" | "apple-pay" | "google-pay" | "visa" | "mastercard" | "card" | "mobile-money";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  distance?: number;
  date?: string;
  rating?: number;
  sortBy?: "date" | "price" | "rating" | "popularity";
}

export type RootStackParamList = {
  "(tabs)": undefined;
  "event/[id]": { id: string };
  "booking/[id]": { id: string };
  "payment/[id]": { id: string };
  "auth/login": undefined;
  "auth/register": undefined;
};
