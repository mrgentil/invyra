import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: string): string {
  const d = new Date(date);
  if (isToday(d)) return "Aujourd'hui";
  if (isTomorrow(d)) return "Demain";
  if (isYesterday(d)) return "Hier";
  return format(d, "dd MMM yyyy", { locale: fr });
}

export function formatTime(date: string): string {
  return format(new Date(date), "HH:mm", { locale: fr });
}

export function formatDateTime(date: string): string {
  return `${formatDate(date)} à ${formatTime(date)}`;
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export { formatAuthError, isAuthCancellation } from "./authErrors";
export { withTimeout, userFromAuthSession } from "./authSession";

export function getRandomColor(): string {
  const colors = [
    "#3B82F6",
    "#0EA5E9",
    "#2ECC71",
    "#FF4D4F",
    "#FF6B35",
    "#00B4D8",
    "#FF6B9D",
    "#2563EB",
    "#38BDF8",
    "#4CC9F0",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
