import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import MapPicker from '@components/MapPicker';

import { useTheme } from '@hooks/useTheme'
import { globalStyles } from '@/styles/globalStyles';

export default function RideRequestScreen() {
  const { colors } = useTheme()
  const styles = createStyles(colors)

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
      <Text style={styles.title}>Request a Ride</Text>

      {/* PICKUP */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setMapMode('pickup')}
      >
        <Text style={styles.label}>Pickup Location</Text>
        <Text style={styles.value}>
          {pickup.label || 'Select pickup on map'}
        </Text>
      </TouchableOpacity>

      {/* DESTINATION */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setMapMode('destination')}
      >
        <Text style={styles.label}>Destination</Text>
        <Text style={styles.value}>
          {destination.label || 'Select destination on map'}
        </Text>
      </TouchableOpacity>

      {/* SUBMIT */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Request Ride</Text>
      </TouchableOpacity>

      {/* MAP PICKER MODAL */}
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
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  inputBox: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: '#666',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#0057D9',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});