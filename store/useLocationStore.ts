import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { DEFAULT_RDC_LOCATION_ID, getRdcLocationById, RdcLocation } from "@/constants/rdcLocations";
import { STORAGE_KEYS } from "@/constants";
import { detectRdcCityId } from "@/services/location/detectCity";
import { isSupabaseConfigured } from "@/lib/supabase";
import { updateProfileInSupabase } from "@/services/supabase/auth";
import { useAuthStore } from "@/store/useAuthStore";

interface LocationState {
  selectedId: string;
  hydrated: boolean;
  pickerVisible: boolean;
  hydrate: () => Promise<void>;
  setLocation: (id: string) => Promise<void>;
  openPicker: () => void;
  closePicker: () => void;
  getSelectedLocation: () => RdcLocation;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  selectedId: DEFAULT_RDC_LOCATION_ID,
  hydrated: false,
  pickerVisible: false,
  hydrate: async () => {
    try {
      const value = await SecureStore.getItemAsync(STORAGE_KEYS.SELECTED_LOCATION);
      if (value && getRdcLocationById(value)) {
        set({ selectedId: value, hydrated: true });
        return;
      }
    } catch {
      // ignore storage errors
    }

    // Pas de ville sélectionnée → tente de détecter via GPS (non bloquant)
    try {
      const detected = await detectRdcCityId();
      if (detected.cityId && getRdcLocationById(detected.cityId)) {
        await SecureStore.setItemAsync(STORAGE_KEYS.SELECTED_LOCATION, detected.cityId);
        set({ selectedId: detected.cityId, hydrated: true });

        // Si l'utilisateur est connecté, on enregistre la ville dans son profil.
        const authUser = useAuthStore.getState().user;
        if (authUser && isSupabaseConfigured()) {
          await updateProfileInSupabase(authUser.id, {
            cityId: detected.cityId,
            cityLabel: detected.cityLabel,
          });
        }
        return;
      }
    } catch {
      // ignore detection errors
    }
    set({ hydrated: true });
  },
  setLocation: async (id) => {
    if (!getRdcLocationById(id)) return;
    await SecureStore.setItemAsync(STORAGE_KEYS.SELECTED_LOCATION, id);
    set({ selectedId: id, pickerVisible: false });

    // Persiste aussi dans le profil si connecté.
    try {
      const authUser = useAuthStore.getState().user;
      if (authUser && isSupabaseConfigured()) {
        await updateProfileInSupabase(authUser.id, {
          cityId: id,
          cityLabel: getRdcLocationById(id)?.label ?? undefined,
        });
      }
    } catch {
      // ignore profile update errors
    }
  },
  openPicker: () => set({ pickerVisible: true }),
  closePicker: () => set({ pickerVisible: false }),
  getSelectedLocation: () => getRdcLocationById(get().selectedId) ?? getRdcLocationById(DEFAULT_RDC_LOCATION_ID)!,
}));
