import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { DEFAULT_RDC_LOCATION_ID, getRdcLocationById, RdcLocation } from "@/constants/rdcLocations";
import { STORAGE_KEYS } from "@/constants";

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
    set({ hydrated: true });
  },
  setLocation: async (id) => {
    if (!getRdcLocationById(id)) return;
    await SecureStore.setItemAsync(STORAGE_KEYS.SELECTED_LOCATION, id);
    set({ selectedId: id, pickerVisible: false });
  },
  openPicker: () => set({ pickerVisible: true }),
  closePicker: () => set({ pickerVisible: false }),
  getSelectedLocation: () => getRdcLocationById(get().selectedId) ?? getRdcLocationById(DEFAULT_RDC_LOCATION_ID)!,
}));
