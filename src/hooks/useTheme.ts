import { useThemeStore, getIsDark } from '@store/themeStore';
import { LIGHT_THEME, DARK_THEME } from '@constants/index';

export const useTheme = () => {
  const mode = useThemeStore((s) => s.mode);

  const isDark = getIsDark(mode);

  return {
    mode,
    isDark,
    colors: isDark ? DARK_THEME : LIGHT_THEME,
  };
};