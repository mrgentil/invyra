import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  isDark: false,
  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    set({ theme: newTheme, isDark: newTheme === "dark" });
  },
  setTheme: (theme) => set({ theme, isDark: theme === "dark" }),
}));
