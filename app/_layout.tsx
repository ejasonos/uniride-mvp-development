import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appearance } from 'react-native';
import { useThemeStore } from '@store/themeStore';

export default function RootLayout() {
  const setMode = useThemeStore((s) => s.setMode);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setMode('system');
    });

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
