import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import Button from '@components/Button';
import Card from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme'
import { createGlobalStyles } from '@styles/globalStyles';

export default function RideTrackingScreen() {
  const router = useRouter();
  const { currentRide, updateRideStatus, isLoading } = useRideStore();
  const { driverLocation, subscribeToDriverLocation, updateDriverLocation } = useLocationStore();
  const { user } = useAuthStore();
  const [mapReady, setMapReady] = useState(false);
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const globalStyles = createGlobalStyles(colors)

  useEffect(() => {
    if (currentRide?.driver_id) {
      subscribeToDriverLocation(currentRide.driver_id, (location) => {
        updateDriverLocation(location);
      });
    }
  }, [currentRide?.driver_id]);

  const handleCompleteRide = async () => {
    try {
      if (!currentRide?.id) return;

      Alert.alert(
        'Complete Ride',
        'Mark this ride as complete?',
        [
          { text: 'Cancel', onPress: () => { } },
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

      {/* FULLSCREEN MAP */}

      <View style={styles.mapWrapper}>
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
            />
          )}
        </MapView>

        {!mapReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        )}
      </View>

      {/* FLOATING STATUS */}

      <View style={styles.statusPill}>
        <View style={styles.liveDot} />

        <Text style={styles.statusPillText}>
          {currentRide?.status?.toUpperCase()}
        </Text>
      </View>

      {/* BOTTOM SHEET */}

      <View style={styles.bottomSheet}>

        <Text style={styles.arrivalTitle}>
          Driver arriving
        </Text>

        <Text style={styles.arrivalTime}>
          3 min away
        </Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Agreed Fare
          </Text>

          <Text style={styles.fareText}>
            ₦{currentRide?.agreed_price?.toLocaleString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Ride Started
          </Text>

          <Text style={styles.infoValue}>
            {new Date(
              currentRide?.created_at || ''
            ).toLocaleTimeString()}
          </Text>
        </View>

        {driverLocation && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Driver Location
            </Text>

            <Text style={styles.infoValue}>
              {driverLocation.latitude.toFixed(4)},
              {' '}
              {driverLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.completeButton,
            currentRide?.status === 'completed' &&
            styles.completeButtonDisabled,
          ]}
          onPress={handleCompleteRide}
          disabled={
            currentRide?.status === 'completed' ||
            isLoading
          }
        >
          <Text style={styles.completeButtonText}>
            Complete Ride
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.SECONDARY,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ACCENT,
  },
  mapContainer: {
    height: 300,
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
    borderBottomColor: colors.LIGHT_GRAY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.ACCENT,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ACCENT,
  },
  actionContainer: {
    paddingVertical: 24,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  statusPill: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 999,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },

  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },

  bottomSheet: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: colors.CARD,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 34,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 20,
  },

  arrivalTitle: {
    fontSize: 14,
    color: colors.TEXT_SECONDARY,
  },

  arrivalTime: {
    marginTop: 6,

    fontSize: 34,
    fontWeight: '800',

    color: colors.TEXT_PRIMARY,
  },

  divider: {
    height: 1,
    backgroundColor: colors.BORDER,
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  infoLabel: {
    color: colors.TEXT_SECONDARY,
  },

  infoValue: {
    color: colors.TEXT_PRIMARY,
    fontWeight: '600',
  },

  fareText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.PRIMARY,
  },

  completeButton: {
    marginTop: 18,

    height: 58,

    borderRadius: 18,

    backgroundColor: colors.PRIMARY,

    justifyContent: 'center',
    alignItems: 'center',
  },

  completeButtonDisabled: {
    opacity: 0.5,
  },

  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
