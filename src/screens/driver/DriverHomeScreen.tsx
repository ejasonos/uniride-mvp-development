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
import MapView, { Marker } from 'react-native-maps';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useLocationStore } from '@store/locationStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export const DriverHomeScreen: React.FC = ({ navigation }: any) => {
  const { user, signOut } = useAuthStore();
  const { rideRequests, fetchPendingRideRequests, isLoading } = useRideStore();
  const { currentLocation } = useLocationStore();
  const [isOnline, setIsOnline] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (isOnline) {
      fetchPendingRideRequests();
      const interval = setInterval(() => {
        fetchPendingRideRequests();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const initialRegion = {
    latitude: currentLocation?.latitude || 6.5244,
    longitude: currentLocation?.longitude || 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleRequestSelect = (requestId: string) => {
    navigation.navigate('SubmitOffer', { rideRequestId: requestId });
  };

  const renderRequestCard = ({ item }: any) => (
    <Card style={styles.requestCard}>
      <View style={globalStyles.rowBetween}>
        <Text style={globalStyles.heading3}>New Request</Text>
        <Text style={styles.badge}>1.2 km away</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.routeContainer}>
        <Text style={globalStyles.bodySmall}>
          <Text style={{ fontWeight: '600' }}>Pickup: </Text>
          Main Campus Gate
        </Text>
        <Text style={[globalStyles.bodySmall, styles.routeMargin]}>
          <Text style={{ fontWeight: '600' }}>Destination: </Text>
          City Center
        </Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleRequestSelect(item.id)}
      >
        <Text style={styles.submitButtonText}>Submit Offer</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.full_name}!</Text>
          <Text style={globalStyles.bodySmall}>
            {isOnline ? 'You are online' : 'Go online to receive requests'}
          </Text>
        </View>
        <Button
          title="Logout"
          onPress={signOut}
          variant="secondary"
          style={{ width: 80 }}
        />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.onlineCard}>
          <View style={globalStyles.rowBetween}>
            <View>
              <Text style={globalStyles.heading3}>Online Status</Text>
              <Text style={globalStyles.bodySmall}>
                {isOnline ? 'Accepting ride requests' : 'Turn on to accept requests'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: COLORS.GRAY, true: COLORS.ACCENT }}
              thumbColor={isOnline ? COLORS.PRIMARY : COLORS.LIGHT_GRAY}
              style={styles.switch}
            />
          </View>
        </Card>

        {isOnline && (
          <>
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

            <View style={styles.requestsHeader}>
              <Text style={globalStyles.heading3}>
                Ride Requests ({rideRequests.length})
              </Text>
            </View>

            {isLoading && rideRequests.length === 0 ? (
              <View style={globalStyles.columnCenter} style={styles.emptyContainer}>
                <ActivityIndicator color={COLORS.PRIMARY} />
                <Text style={[globalStyles.bodySmall, styles.emptyText]}>
                  Looking for requests...
                </Text>
              </View>
            ) : rideRequests.length === 0 ? (
              <View style={globalStyles.columnCenter} style={styles.emptyContainer}>
                <Text style={globalStyles.bodyMedium}>No requests nearby</Text>
                <Text style={globalStyles.bodySmall}>
                  Check back soon for new ride requests
                </Text>
              </View>
            ) : (
              <FlatList
                data={rideRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequestCard}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </>
        )}

        {!isOnline && (
          <View style={globalStyles.columnCenter} style={styles.offlineContainer}>
            <Text style={globalStyles.heading3}>You are offline</Text>
            <Text style={[globalStyles.bodySmall, styles.offlineText]}>
              Toggle the switch above to go online and start receiving ride requests
            </Text>
          </View>
        )}

        <View style={styles.actionContainer}>
          <Button
            title="View History"
            onPress={() => navigation.navigate('DriverHistory')}
            variant="secondary"
          />
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
  onlineCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
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
  requestsHeader: {
    marginVertical: 12,
  },
  requestCard: {
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY,
    marginVertical: 12,
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeMargin: {
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.SECONDARY,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  offlineText: {
    marginTop: 12,
    marginHorizontal: 24,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  actionContainer: {
    paddingVertical: 24,
  },
});
