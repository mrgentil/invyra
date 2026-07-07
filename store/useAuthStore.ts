import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, resetSupabaseAuth } from "@/lib/supabase";
import { User } from "@/types";
import {
  fetchProfileFromSupabase,
  getCurrentSession,
  signOutFromSupabase,
} from "@/services/supabase/auth";
import { userFromAuthSession, withTimeout } from "@/utils/authSession";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  applySession: (session: Session) => Promise<User>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export async function resolveUserFromSession(userId: string, email: string): Promise<User> {
  if (isSupabaseConfigured()) {
    return fetchProfileFromSupabase(userId, email);
  }

  return {
    id: userId,
    name: email.split("@")[0],
    email,
    phone: "",
    avatar: "",
    preferences: [],
    tickets: [],
    favorites: [],
    notifications: [],
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  hydrated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  applySession: async (session) => {
    const email = session.user.email;
    if (!email) {
      throw new Error("E-mail manquant dans la session.");
    }

    const fallbackUser = userFromAuthSession(session);
    set({
      user: fallbackUser,
      token: session.access_token,
      isAuthenticated: true,
    });

    if (!isSupabaseConfigured()) {
      return fallbackUser;
    }

    try {
      const profile = await withTimeout(
        fetchProfileFromSupabase(session.user.id, email),
        8000,
        "Chargement du profil trop long."
      );
      set({ user: profile, token: session.access_token, isAuthenticated: true });
      return profile;
    } catch {
      return fallbackUser;
    }
  },
  hydrate: async () => {
    if (!isSupabaseConfigured()) {
      set({ hydrated: true });
      return;
    }

    try {
      const session = await getCurrentSession();
      if (session?.user?.email) {
        const fallbackUser = userFromAuthSession(session);
        set({
          user: fallbackUser,
          token: session.access_token,
          isAuthenticated: true,
          hydrated: true,
        });

        try {
          const profile = await withTimeout(
            fetchProfileFromSupabase(session.user.id, session.user.email),
            8000,
            "profile timeout"
          );
          set({ user: profile, token: session.access_token, isAuthenticated: true });
        } catch {
          // garde le profil issu de la session
        }
        return;
      }
    } catch {
      await resetSupabaseAuth();
    }

    set({ user: null, token: null, isAuthenticated: false, hydrated: true });
  },
  logout: async () => {
    if (isSupabaseConfigured()) {
      await signOutFromSupabase();
    } else {
      await resetSupabaseAuth();
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
