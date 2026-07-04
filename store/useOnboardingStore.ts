import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/constants";

interface OnboardingState {
  completed: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  hydrated: false,
  hydrate: async () => {
    try {
      const value = await SecureStore.getItemAsync(STORAGE_KEYS.ONBOARDING);
      set({ completed: value === "true", hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  complete: async () => {
    await SecureStore.setItemAsync(STORAGE_KEYS.ONBOARDING, "true");
    set({ completed: true });
  },
  reset: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ONBOARDING);
    set({ completed: false });
  },
}));
