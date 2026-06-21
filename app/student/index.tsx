import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';

import { COLORS } from '@constants/index';

import { useThemeStore } from '@store/themeStore';
import { createGlobalStyles } from '@styles/index';

export default function StudentHomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { currentRide } = useRideStore();
  const { currentLocation } = useLocationStore();

  const isDark = useThemeStore((s) => s.isDark);
  const globalStyles = createGlobalStyles(isDark);

  const [mapReady, setMapReady] = useState(false);

  const hasActiveRide = currentRide && currentRide.status !== 'completed';

  const go = (path: string) => router.push(path);

  const initialRegion = {
    latitude: currentLocation?.latitude || 6.5244,
    longitude: currentLocation?.longitude || 3.3792,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  return (
    <SafeAreaView style={globalStyles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.full_name}</Text>
          <Text style={styles.subText}>Where to next?</Text>
        </View>

        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* PRIMARY STATUS CARD */}
        <View style={styles.primaryCard}>
          {hasActiveRide ? (
            <>
              <Text style={styles.cardTitle}>Active Ride</Text>
              <Text style={styles.statusText}>
                Status: {currentRide.status}
              </Text>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => go('/student/ride-tracking')}
              >
                <Text style={styles.primaryBtnText}>Track Ride</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>No Active Ride</Text>
              <Text style={styles.statusText}>
                Book a ride in seconds
              </Text>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => go('/student/ride-request')}
              >
                <Text style={styles.primaryBtnText}>Request Ride</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* MAP (context only, not dominant) */}
        <View style={styles.mapCard}>
          {mapReady ? null : (
            <ActivityIndicator color={COLORS.PRIMARY} />
          )}

          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onMapReady={() => setMapReady(true)}
          >
            {currentLocation && (
              <Marker coordinate={currentLocation} />
            )}
          </MapView>
        </View>

        {/* QUICK ACTION CHIPS (Google UX pattern) */}
        <View style={styles.chipsContainer}>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => go('/student/history')}
          >
            <Text style={styles.chipText}>Ride History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => go('/student/ride-offers')}
          >
            <Text style={styles.chipText}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => go('/student/negotiation-chat')}
          >
            <Text style={styles.chipText}>Chat</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  /* CONTAINER */
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },

  /* HEADER (Google clean bar) */
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  subText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  logout: {
    color: '#D32F2F',
    fontWeight: '600',
  },

  /* CONTENT */
  content: {
    padding: 16,
  },

  /* PRIMARY CARD (Uber-style action focus) */
  primaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  /* MAP (low visual priority) */
  mapCard: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#EDEFF3',
  },
  map: {
    flex: 1,
  },

  /* CHIPS (Google UX pattern) */
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
});