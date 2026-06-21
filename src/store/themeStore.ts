import { create } from 'zustand';

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,

  toggleTheme: () =>
    set((state) => ({ isDark: !state.isDark })),

  setDarkMode: (value) => set({ isDark: value }),
}));