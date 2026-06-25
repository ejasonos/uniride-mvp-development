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

import { useTheme } from '@hooks/useTheme'
import { createGlobalStyles } from '@styles/globalStyles'

import ThemeToggle from '@components/ThemeToggle';
import { UNIBEN_REGION } from '@constants/maps';

export default function StudentHomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { currentRide } = useRideStore();
  const { currentLocation } = useLocationStore();

  const [mapReady, setMapReady] = useState(false);

  const hasActiveRide = currentRide && currentRide.status !== 'completed';

  const go = (path: string) => router.push(path);

  const { colors } = useTheme()
  const styles = createStyles(colors)
  const globalStyles = createGlobalStyles(colors)

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* HERO HEADER */}
      <View style={styles.heroContainer}>

        <View style={styles.topBar}>

          <View>
            <Text style={styles.greeting}>
              Good Morning
            </Text>

            <Text style={styles.userName}>
              {user?.full_name || 'Student'}
            </Text>
          </View>

          <View style={styles.headerActions}>

            <TouchableOpacity style={styles.iconButton}>
              <ThemeToggle />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={signOut}
            >
              <Text style={styles.profileInitial}>
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>

          </View>

        </View>

        <Text style={styles.heroTitle}>
          Where are you going?
        </Text>

        <Text style={styles.heroSubtitle}>
          Fast campus rides in minutes
        </Text>

        <TouchableOpacity
          style={styles.searchCard}
          onPress={() => go('/student/ride-request')}
        >
          <Text style={styles.searchIcon}>🔍</Text>

          <Text style={styles.searchText}>
            Enter destination
          </Text>
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
            <ActivityIndicator color={colors.PRIMARY} />
          )}

          <MapView
            style={styles.map}
            initialRegion={UNIBEN_REGION}
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
            onPress={() => router.push('/student/negotiation-chat')}
          >
            <Text style={styles.chipText}>Chat</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  /* HEADER (Google clean bar) */
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  modeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.CARD || colors.SECONDARY,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.PRIMARY,
  },
  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 20
  },

  greeting: {
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
    fontWeight: '500',
  },

  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.TEXT_PRIMARY,
    marginTop: 2,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.CARD || '#FFFFFF',
  },

  profileInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.TEXT_PRIMARY,
    lineHeight: 40,
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.TEXT_SECONDARY,
    marginBottom: 22,
  },

  searchCard: {
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.CARD || '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  searchText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
  },
  subText: {
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
    marginTop: 2,
  },
  logout: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  hero: {
    marginBottom: 10,
  },

  /* CONTENT */
  content: {
    padding: 16,
  },

  /* PRIMARY CARD (Uber-style action focus) */
  primaryCard: {
    backgroundColor: colors.ACCENT,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.CARD,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
  },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: colors.PRIMARY,
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
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },

  /* CHIPS (Google UX pattern) */
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 10,
  },
  chip: {
    backgroundColor: colors.SECONDARY,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY
  },
});