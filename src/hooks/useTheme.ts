import { useThemeStore } from '@store/themeStore';
import { DARK_THEME, LIGHT_THEME } from '@constants/index';

export const useTheme = () => {
  const isDark = useThemeStore((s) => s.isDark);

  return {
    isDark,
    colors: isDark ? DARK_THEME : LIGHT_THEME,
  };
};