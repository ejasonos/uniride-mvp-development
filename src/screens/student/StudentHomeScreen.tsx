import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export const StudentHomeScreen: React.FC = ({ navigation }: any) => {
  const { user, signOut } = useAuthStore();
  const { currentRide } = useRideStore();
  const { currentLocation } = useLocationStore();
  const [mapReady, setMapReady] = useState(false);

  const hasActiveRide = currentRide && currentRide.status !== 'completed';

  const initialRegion = {
    latitude: currentLocation?.latitude || 6.5244,
    longitude: currentLocation?.longitude || 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleQuickAction = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.full_name}!</Text>
          <Text style={globalStyles.bodySmall}>Ready for a ride?</Text>
        </View>
        <Button
          title="Logout"
          onPress={signOut}
          variant="secondary"
          style={{ width: 80 }}
        />
      </View>

      <ScrollView style={styles.content}>
        {hasActiveRide ? (
          <Card style={styles.activeRideCard}>
            <Text style={globalStyles.heading3}>Active Ride</Text>
            <Text style={[globalStyles.bodySmall, styles.rideStatus]}>
              Status: {currentRide.status}
            </Text>
            <Button
              title="View Tracking"
              onPress={() => handleQuickAction('RideTracking')}
              variant="primary"
              style={styles.button}
            />
          </Card>
        ) : (
          <Card style={styles.card}>
            <Text style={globalStyles.heading3}>Start a New Ride</Text>
            <Text style={globalStyles.bodySmall}>
              Request a ride and negotiate with our drivers
            </Text>
            <Button
              title="Request a Ride"
              onPress={() => handleQuickAction('RideRequest')}
              variant="primary"
              style={styles.button}
            />
          </Card>
        )}

        <View style={styles.mapContainer}>
          {mapReady ? (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              onMapReady={() => setMapReady(true)}
            >
              {currentLocation && (
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Your Location"
                  description="You are here"
                />
              )}
            </MapView>
          ) : (
            <View style={globalStyles.columnCenter} style={styles.mapPlaceholder}>
              <ActivityIndicator color={COLORS.PRIMARY} />
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('RideHistory')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={globalStyles.bodySmall}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('RideOffers')}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={globalStyles.bodySmall}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('NegotiationChat')}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={globalStyles.bodySmall}>Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  activeRideCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
  },
  rideStatus: {
    marginVertical: 8,
    color: '#2E7D32',
    fontWeight: '600',
  },
  button: {
    marginTop: 12,
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
});
