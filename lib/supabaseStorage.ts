import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const SECURE_STORE_LIMIT = 2048;

/**
 * Stockage Supabase Auth — AsyncStorage pour les sessions (souvent > 2 Ko).
 * SecureStore reste utilisé uniquement pour les petites valeurs si besoin.
 */
export const SupabaseAuthStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const fromAsync = await AsyncStorage.getItem(key);
    if (fromAsync != null) return fromAsync;

    try {
      const fromSecure = await SecureStore.getItemAsync(key);
      if (fromSecure != null) {
        await AsyncStorage.setItem(key, fromSecure);
        await SecureStore.deleteItemAsync(key);
        return fromSecure;
      }
    } catch {
      // ignore migration errors
    }

    return null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);

    if (value.length <= SECURE_STORE_LIMIT) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // ignore
      }
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore — la session vit dans AsyncStorage
    }
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};

export async function clearSupabaseAuthKeys(keys: string[]): Promise<void> {
  await Promise.all(
    keys.map(async (key) => {
      await AsyncStorage.removeItem(key);
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // ignore
      }
    })
  );
}
