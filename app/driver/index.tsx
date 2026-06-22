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
import { globalStyles } from '@/styles/globalStyles';

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { rideRequests, fetchPendingRideRequests, isLoading } = useRideStore();
  const { currentLocation } = useLocationStore();

  const [isOnline, setIsOnline] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.full_name}</Text>
          <Text style={styles.statusText}>
            {isOnline ? 'Online • Receiving requests' : 'Offline'}
          </Text>
        </View>

        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: colors.GRAY, true: colors.ACCENT }}
          thumbColor={isOnline ? colors.PRIMARY : colors.LIGHT_GRAY}
        />
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
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push('/driver/history')}
            style={styles.historyBtn}
          >
            <Text style={styles.historyText}>View Ride History</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
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
    greeting: {
      color: colors.SECONDARY,
      fontSize: 18,
      fontWeight: '700',
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
    mapCard: {
      height: 180,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
    },
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
    requestCard: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
    },
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
  });