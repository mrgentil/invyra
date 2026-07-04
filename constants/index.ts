export const API_BASE_URL = "https://api.invyra.com/v1";
export const API_TIMEOUT = 30000;
export const PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 300;
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme",
  ONBOARDING: "onboarding_completed",
  FAVORITES: "favorites",
  SELECTED_LOCATION: "selected_location",
  SEARCH_HISTORY: "search_history",
} as const;

export const QUERY_KEYS = {
  events: "events",
  event: "event",
  categories: "categories",
  organizers: "organizers",
  tickets: "tickets",
  user: "user",
  notifications: "notifications",
  favorites: "favorites",
} as const;
