import { create } from 'zustand';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',

  setMode: (mode) => set({ mode }),

  toggle: () => {
    const current = get().mode;

    set({
      mode: current === 'dark' ? 'light' : 'dark',
    });
  },
}));

export const getIsDark = (mode: ThemeMode) => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }

  return mode === 'dark';
};