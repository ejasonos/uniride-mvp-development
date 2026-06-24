import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';
import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@/styles/globalStyles';

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { rideRequests, fetchPendingRideRequests, isLoading } = useRideStore();
  const { currentLocation } = useLocationStore();

  const [isOnline, setIsOnline] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors)

  useEffect(() => {
    if (!isOnline) return;

    fetchPendingRideRequests();

    const interval = setInterval(fetchPendingRideRequests, 8000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const initialRegion = {
    latitude: currentLocation?.latitude || 6.5244,
    longitude: currentLocation?.longitude || 3.3792,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const handleSelect = (id: string) => {
    router.push({
      pathname: '/driver/submit-offer',
      params: { rideRequestId: id },
    });
  };

  const renderRequest = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.id)}
        style={styles.requestCard}
        activeOpacity={0.85}
      >
        <View style={styles.requestTopRow}>
          <Text style={styles.requestTitle}>New Ride Request</Text>
          <Text style={styles.distanceBadge}>~1.2 km</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Pickup: <Text style={styles.value}>Main Campus Gate</Text>
        </Text>

        <Text style={styles.label}>
          Destination: <Text style={styles.value}>City Center</Text>
        </Text>

        <View style={styles.ctaRow}>
          <Text style={styles.ctaHint}>Tap to submit offer →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>

      {/* HEADER / DRIVER STATUS */}
      <View style={styles.topBar}>

        <View>

          <Text style={styles.welcome}>
            Good Morning 👋
          </Text>

          <Text style={styles.driverName}>
            {user?.full_name || 'Driver'}
          </Text>

        </View>

        <TouchableOpacity
          style={[
            styles.onlineBadge,
            {
              backgroundColor: isOnline
                ? '#D7F5E7'
                : '#FFE8E8',
            },
          ]}
        >
          <Text
            style={{
              color: isOnline
                ? '#0F9D58'
                : '#D93025',
              fontWeight: '700',
            }}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>

      </View>
      <View style={styles.heroCard}>

        <Text style={styles.heroTitle}>
          {isOnline
            ? "You're Online"
            : "Go Online"}
        </Text>

        <Text style={styles.heroSubtitle}>
          {isOnline
            ? `${rideRequests.length} ride requests nearby`
            : "Start receiving ride requests"}
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={styles.heroButtonText}>
            {isOnline
              ? 'Go Offline'
              : 'Go Online'}
          </Text>
        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* MAP PREVIEW (small, not dominant) */}
        {isOnline && (
          <View style={styles.mapCard}>
            <MapView style={styles.map} initialRegion={initialRegion}>
              {currentLocation && (
                <Marker coordinate={currentLocation} />
              )}
            </MapView>
          </View>
        )}

        {/* REQUESTS HEADER */}
        {isOnline && (
          <Text style={styles.sectionTitle}>
            Incoming Requests ({rideRequests.length})
          </Text>
        )}

        {/* STATES */}
        {!isOnline && (
          <View style={styles.centerState}>
            <Text style={styles.centerTitle}>You are offline</Text>
            <Text style={styles.centerText}>
              Turn on online mode to receive ride requests
            </Text>
          </View>
        )}

        {isOnline && isLoading && rideRequests.length === 0 && (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.PRIMARY} />
            <Text style={styles.centerText}>Searching requests...</Text>
          </View>
        )}

        {isOnline && rideRequests.length === 0 && !isLoading && (
          <View style={styles.centerState}>
            <Text style={styles.centerTitle}>No nearby requests</Text>
            <Text style={styles.centerText}>
              Stay online — requests will appear here
            </Text>
          </View>
        )}

        {/* REQUEST LIST */}
        {isOnline && rideRequests.length > 0 && (
          <FlatList
            data={rideRequests}
            renderItem={renderRequest}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}

        {/* ACTIONS */}
        <View style={styles.footerActions}>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/driver/history')}
          >
            <Text style={styles.secondaryButtonText}>
              Ride History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.dangerButtonText}>
              Logout
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const createStyles = (colors: any) =>
  StyleSheet.create({
    /* HEADER */
    header: {
      padding: 16,
      backgroundColor: colors.PRIMARY,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusText: {
      color: colors.SECONDARY,
      fontSize: 12,
      marginTop: 2,
      opacity: 0.85,
    },

    /* CONTENT */
    content: {
      padding: 16,
    },

    /* MAP */
    map: {
      flex: 1,
    },

    /* SECTIONS */
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
      color: colors.TEXT_PRIMARY,
    },

    /* REQUEST CARD */
    requestTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    requestTitle: {
      fontSize: 14,
      fontWeight: '700',
    },
    distanceBadge: {
      fontSize: 12,
      backgroundColor: colors.ACCENT,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: colors.GRAY,
      marginVertical: 10,
    },
    label: {
      fontSize: 13,
      marginTop: 4,
      color: colors.TEXT_SECONDARY,
    },
    value: {
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    ctaRow: {
      marginTop: 10,
    },
    ctaHint: {
      fontSize: 12,
      color: colors.PRIMARY,
      fontWeight: '600',
    },

    /* EMPTY STATES */
    centerState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    centerTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginTop: 8,
    },
    centerText: {
      fontSize: 13,
      marginTop: 6,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
    },

    /* FOOTER */
    footer: {
      marginTop: 20,
      gap: 10,
    },

    historyBtn: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors.LIGHT_GRAY,
      alignItems: 'center',
    },
    historyText: {
      fontWeight: '600',
    },

    logoutBtn: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: '#FFE5E5',
      alignItems: 'center',
    },
    logoutText: {
      color: '#C62828',
      fontWeight: '600',
    },
    topBar: {
      marginTop: 20,
      paddingHorizontal: 24,
      paddingTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    welcome: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.TEXT_SECONDARY,
    },

    driverName: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginTop: 4,
    },

    onlineBadge: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
    },

    heroCard: {
      margin: 24,
      padding: 24,
      borderRadius: 24,
      backgroundColor: colors.PRIMARY,
    },

    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#FFF',
    },

    heroSubtitle: {
      marginTop: 8,
      color: 'rgba(255,255,255,0.8)',
    },

    heroButton: {
      marginTop: 20,
      backgroundColor: '#FFF',
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
    },

    heroButtonText: {
      color: colors.PRIMARY,
      fontWeight: '800',
    },

    mapCard: {
      height: 220,
      borderRadius: 24,
      overflow: 'hidden',
      marginHorizontal: 24,
      marginBottom: 24,
    },

    requestCard: {
      backgroundColor: colors.CARD,
      marginBottom: 16,
      borderRadius: 24,
      padding: 20,
    },

    requestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },

    requestBadge: {
      backgroundColor: '#EAF6FF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    requestBadgeText: {
      color: '#0066FF',
      fontWeight: '700',
      fontSize: 12,
    },

    distanceText: {
      fontWeight: '700',
    },

    routeContainer: {
      marginBottom: 20,
    },

    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    pickupDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#0F9D58',
    },

    destinationDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#D93025',
    },

    routeLine: {
      width: 2,
      height: 28,
      backgroundColor: colors.GRAY,
      marginLeft: 5,
      marginVertical: 4,
    },

    locationText: {
      marginLeft: 12,
      fontWeight: '600',
      fontSize: 15,
    },

    offerButton: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
    },

    offerButtonText: {
      color: '#FFF',
      fontWeight: '700',
    },

    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },

    actionCard: {
      flex: 1,
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.CARD,
      alignItems: 'center',
    },

    actionIcon: {
      fontSize: 24,
    },

    actionLabel: {
      marginTop: 10,
      fontWeight: '700',
    },
    footerActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
      marginBottom: 32,
    },

    secondaryButton: {
      flex: 1,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.BORDER || '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },

    secondaryButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },

    dangerButton: {
      flex: 1,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFF1F2',
      justifyContent: 'center',
      alignItems: 'center',
    },

    dangerButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#DC2626',
    },
  });