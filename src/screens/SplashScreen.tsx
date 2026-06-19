import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@constants/index';

export const SplashScreen: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>UniRide</Text>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

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
  loader: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
