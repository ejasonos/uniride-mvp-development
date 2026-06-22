import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

import { useTheme } from '@hooks/useTheme';
import { UNIBEN_REGION } from '@/constants/maps';

type Props = {
  onSelect: (location: {
    latitude: number;
    longitude: number;
    label: string;
  }) => void;
  onClose: () => void;
};

export default function MapPicker({
  onSelect,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [pin, setPin] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } =
      event.nativeEvent.coordinate;

    setPin({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (!pin) return;

    onSelect({
      latitude: pin.latitude,
      longitude: pin.longitude,
      label: 'Selected Location',
    });

    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={UNIBEN_REGION}
      >
        {pin && (
          <Marker coordinate={pin} />
        )}
      </MapView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onClose}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            !pin && styles.disabled,
          ]}
          onPress={confirmLocation}
          disabled={!pin}
        >
          <Text style={styles.confirmText}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    map: {
      flex: 1,
    },

    footer: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
      flexDirection: 'row',
      gap: 10,
    },

    cancelBtn: {
      flex: 1,
      backgroundColor: colors.CARD,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },

    confirmBtn: {
      flex: 1,
      backgroundColor: colors.PRIMARY,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },

    disabled: {
      opacity: 0.5,
    },

    cancelText: {
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },

    confirmText: {
      fontWeight: '600',
      color: colors.SECONDARY,
    },
  });