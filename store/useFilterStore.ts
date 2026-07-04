import { create } from "zustand";
import { FilterOptions } from "@/types";

interface FilterState {
  filters: FilterOptions;
  isVisible: boolean;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  showFilters: () => void;
  hideFilters: () => void;
  toggleFilters: () => void;
}

const defaultFilters: FilterOptions = {
  priceRange: [0, 500],
  distance: 50,
  rating: 0,
  sortBy: "popularity",
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  isVisible: false,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  showFilters: () => set({ isVisible: true }),
  hideFilters: () => set({ isVisible: false }),
  toggleFilters: () => set((state) => ({ isVisible: !state.isVisible })),
}));
