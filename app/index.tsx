import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@constants/index';
import { createGlobalStyles } from '@styles/index';
import { useThemeStore } from '@store/themeStore';

export default function Index() {
  const isDark = useThemeStore((s) => s.isDark);
  const globalStyles = createGlobalStyles(isDark);
  const {
    initializeAuth,
    isInitialized,
    user,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    console.log('AUTH INITIALIZED');
    console.log('USER:', user);

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (user.role === 'driver') {
      router.replace('/driver');
      return;
    }

    router.replace('/student');
  }, [isInitialized, user]);

  return (
    <View style={globalStyles.container}>
      <Text style={styles.logo}>UniRide</Text>

      <ActivityIndicator
        size="large"
        color={COLORS.PRIMARY}
      />

      <Text style={styles.subtitle}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});