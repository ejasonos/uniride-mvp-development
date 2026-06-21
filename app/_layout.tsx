import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appearance } from 'react-native';
import { useThemeStore } from '@store/themeStore';

export default function RootLayout() {
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });

    return () => listener.remove();
  }, [setDarkMode]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}