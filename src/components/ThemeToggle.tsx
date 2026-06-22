import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@hooks/useTheme';
import { useThemeStore } from '@store/themeStore';

export default function ThemeToggle() {
  const { isDark } = useTheme();
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <TouchableOpacity
      onPress={toggle}
      style={{ padding: 8 }}
    >
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={22}
        color={isDark ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );
}