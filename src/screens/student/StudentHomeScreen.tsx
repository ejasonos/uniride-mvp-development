import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Button } from '@components/Button';
import { useAuthStore } from '@store/authStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export const StudentHomeScreen: React.FC = ({ navigation }: any) => {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Home</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Welcome, {user?.full_name}!</Text>
        <Text style={styles.subtitle}>Coming Soon: Ride Request, Tracking & Payment</Text>

        <Button
          title="Sign Out"
          onPress={signOut}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
  },
  button: {
    marginVertical: 16,
  },
});
