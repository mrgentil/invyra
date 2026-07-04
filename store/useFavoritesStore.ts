import { create } from "zustand";

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  addFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites
        : [...state.favorites, id],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((fid) => fid !== id),
    })),
  toggleFavorite: (id) => {
    const isFav = get().favorites.includes(id);
    if (isFav) {
      get().removeFavorite(id);
    } else {
      get().addFavorite(id);
    }
  },
  isFavorite: (id) => get().favorites.includes(id),
}));
