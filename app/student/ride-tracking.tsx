import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';
import { useAuthStore } from '@store/authStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export default function RideTrackingScreen() {
  const router = useRouter();
  const { currentRide, updateRideStatus, isLoading } = useRideStore();
  const { driverLocation, subscribeToLocation, updateLocation } = useLocationStore();
  const { user } = useAuthStore();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (currentRide?.id) {
      subscribeToLocation(currentRide.driver_id);
    }
  }, [currentRide?.id]);

  const handleCompleteRide = async () => {
    try {
      if (!currentRide?.id) return;

      Alert.alert(
        'Complete Ride',
        'Mark this ride as complete?',
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Complete',
            onPress: async () => {
              await updateRideStatus(currentRide.id, 'completed');
              Alert.alert('Ride Completed', 'Proceeding to payment...');
              router.push('/student/payment');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const initialRegion = {
    latitude: driverLocation?.latitude || 6.5244,
    longitude: driverLocation?.longitude || 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tracking Driver</Text>
        <Text style={styles.status}>{currentRide?.status.toUpperCase()}</Text>
      </View>

      <View style={styles.mapContainer}>
        {mapReady ? (
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onMapReady={() => setMapReady(true)}
          >
            {driverLocation && (
              <Marker
                coordinate={{
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                }}
                title="Driver Location"
                description="Your driver is here"
              />
            )}
          </MapView>
        ) : (
          <View style={globalStyles.columnCenter} style={styles.mapPlaceholder}>
            <ActivityIndicator color={COLORS.PRIMARY} />
            <Text style={globalStyles.bodySmall}>Loading map...</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Ride Details</Text>

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodyMedium}>Status:</Text>
            <Text style={styles.statusBadge}>{currentRide?.status}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodyMedium}>Price Agreed:</Text>
            <Text style={styles.price}>₦{currentRide?.agreed_price.toLocaleString()}</Text>
          </View>

          {driverLocation && (
            <View style={styles.detailRow}>
              <Text style={globalStyles.bodyMedium}>Driver Location:</Text>
              <Text style={globalStyles.bodySmall}>
                {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodyMedium}>Started:</Text>
            <Text style={globalStyles.bodySmall}>
              {new Date(currentRide?.created_at || '').toLocaleTimeString()}
            </Text>
          </View>
        </Card>

        <View style={styles.actionContainer}>
          <Button
            title={isLoading ? 'Processing...' : 'Complete Ride'}
            onPress={handleCompleteRide}
            variant="primary"
            disabled={isLoading || currentRide?.status === 'completed'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ACCENT,
  },
  mapContainer: {
    height: 300,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  actionContainer: {
    paddingVertical: 24,
  },
});
