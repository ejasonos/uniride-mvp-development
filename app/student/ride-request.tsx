import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import MapPicker from '@components/MapPicker';

import { useTheme } from '@hooks/useTheme'
import { createGlobalStyles } from '@/styles/globalStyles';

export default function RideRequestScreen() {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const globalStyles = createGlobalStyles(colors)

  const [mapMode, setMapMode] = useState<'pickup' | 'destination' | null>(null);

  const [pickup, setPickup] = useState({
    label: '',
    latitude: 0,
    longitude: 0,
  });

  const [destination, setDestination] = useState({
    label: '',
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = () => {
    if (!pickup.latitude || !destination.latitude) return;

    console.log('Ride Request:', {
      pickup,
      destination,
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Request Ride
          </Text>

          <Text style={styles.headerSubtitle}>
            Choose pickup and destination
          </Text>
        </View>

        {/* PICKUP */}

        <TouchableOpacity
          style={styles.locationCard}
          onPress={() => setMapMode('pickup')}
        >
          <View style={styles.locationDotGreen} />

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>
              Pickup
            </Text>

            <Text style={styles.locationValue}>
              {pickup.label || 'Choose pickup point'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* DESTINATION */}

        <TouchableOpacity
          style={styles.locationCard}
          onPress={() => setMapMode('destination')}
        >
          <View style={styles.locationDotRed} />

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>
              Destination
            </Text>

            <Text style={styles.locationValue}>
              {destination.label || 'Choose destination'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ROUTE PREVIEW */}

        <View style={styles.mapPreview}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 6.4018,
              longitude: 5.6145,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >

            {pickup.latitude !== 0 && (
              <Marker
                coordinate={{
                  latitude: pickup.latitude,
                  longitude: pickup.longitude,
                }}
              />
            )}

            {destination.latitude !== 0 && (
              <Marker
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                pinColor="red"
              />
            )}

          </MapView>
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Trip Summary
          </Text>

          <Text style={styles.summaryText}>
            Select locations to see route details
          </Text>
        </View>

      </ScrollView>

      {/* FIXED CTA */}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.requestButton,
            (!pickup.latitude || !destination.latitude) &&
            styles.requestButtonDisabled,
          ]}
          disabled={!pickup.latitude || !destination.latitude}
          onPress={handleSubmit}
        >
          <Text style={styles.requestButtonText}>
            Request Ride
          </Text>
        </TouchableOpacity>
      </View>

      {mapMode && (
        <MapPicker
          onSelect={(location) => {
            if (mapMode === 'pickup') {
              setPickup(location);
            } else {
              setDestination(location);
            }

            setMapMode(null);
          }}
          onClose={() => setMapMode(null)}
        />
      )}

    </SafeAreaView>
  )
}

const createStyles = (colors: any) => StyleSheet.create({
  content: {
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 140,
},

header: {
  marginBottom: 28,
},

headerTitle: {
  fontSize: 32,
  fontWeight: '800',
  color: colors.TEXT_PRIMARY,
},

headerSubtitle: {
  marginTop: 6,
  fontSize: 15,
  color: colors.TEXT_SECONDARY,
},

locationCard: {
  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: colors.CARD,

  padding: 18,

  borderRadius: 20,

  marginBottom: 14,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
},

locationDotGreen: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#22C55E',
},

locationDotRed: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#EF4444',
},

locationContent: {
  marginLeft: 14,
  flex: 1,
},

locationLabel: {
  fontSize: 12,
  color: colors.TEXT_SECONDARY,
},

locationValue: {
  marginTop: 4,
  fontSize: 16,
  fontWeight: '700',
  color: colors.TEXT_PRIMARY,
},

mapPreview: {
  height: 260,

  borderRadius: 24,

  overflow: 'hidden',

  marginTop: 10,
  marginBottom: 18,

  backgroundColor: '#EEE',
},

map: {
  flex: 1,
},

summaryCard: {
  backgroundColor: colors.CARD,

  padding: 18,

  borderRadius: 20,
},

summaryTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: colors.TEXT_PRIMARY,
},

summaryText: {
  marginTop: 6,
  color: colors.TEXT_SECONDARY,
},

bottomBar: {
  position: 'absolute',

  bottom: 0,
  left: 0,
  right: 0,

  padding: 20,

  backgroundColor: colors.BACKGROUND,

  borderTopWidth: 1,
  borderTopColor: colors.BORDER,
},

requestButton: {
  height: 58,

  borderRadius: 18,

  backgroundColor: colors.PRIMARY,

  justifyContent: 'center',
  alignItems: 'center',
},

requestButtonDisabled: {
  opacity: 0.4,
},

requestButtonText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '800',
},
})