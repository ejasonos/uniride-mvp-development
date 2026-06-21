import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Card } from '@components/Card';
import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { createGlobalStyles } from '@styles/index';
import { useThemeStore } from '@store/themeStore';
import { COLORS } from '@constants/index';

const rideRequestSchema = z.object({
  pickupLocation: z.string().min(3, 'Pickup location is required'),
  pickupLat: z.string().transform((v) => parseFloat(v)),
  pickupLng: z.string().transform((v) => parseFloat(v)),
  destinationLocation: z.string().min(3, 'Destination is required'),
  destinationLat: z.string().transform((v) => parseFloat(v)),
  destinationLng: z.string().transform((v) => parseFloat(v)),
});

type RideRequestForm = z.infer<typeof rideRequestSchema>;

export default function RideRequestScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createRideRequest, isLoading } = useRideStore();
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'destination' | null>(null);
  const isDark = useThemeStore((s) => s.isDark);
  const globalStyles = createGlobalStyles(isDark);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RideRequestForm>({
    resolver: zodResolver(rideRequestSchema),
  });

  const pickupLocation = watch('pickupLocation');
  const destinationLocation = watch('destinationLocation');

  const onSubmit = async (data: RideRequestForm) => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }

      await createRideRequest(
        user.id,
        data.pickupLocation,
        data.pickupLat,
        data.pickupLng,
        data.destinationLocation,
        data.destinationLat,
        data.destinationLng
      );

      Alert.alert('Success', 'Ride request created! Waiting for driver offers.');
      router.push('/student/ride-offers');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create ride request');
    }
  };

  const handleSetPickupLocation = () => {
    // For now, use sample university location
    setValue('pickupLocation', 'Main Campus Gate');
    setValue('pickupLat', '6.8276');
    setValue('pickupLng', '3.0394');
    setShowLocationPicker(null);
  };

  const handleSetDestinationLocation = () => {
    // For now, use sample destination
    setValue('destinationLocation', 'City Center');
    setValue('destinationLat', '6.5244');
    setValue('destinationLng', '3.3792');
    setShowLocationPicker(null);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request a Ride</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Pickup Location</Text>
          <Input
            label="Pickup Location"
            control={control}
            name="pickupLocation"
            placeholder="Enter pickup location"
            editable={false}
            onPress={() => setShowLocationPicker('pickup')}
          />
          {errors.pickupLocation && (
            <Text style={globalStyles.errorText}>{errors.pickupLocation.message}</Text>
          )}

          {showLocationPicker === 'pickup' && (
            <View style={styles.locationOptions}>
              <Button
                title="Use Main Campus Gate"
                onPress={handleSetPickupLocation}
                variant="primary"
                style={styles.locationButton}
              />
              <Button
                title="Use Current Location"
                onPress={handleSetPickupLocation}
                variant="secondary"
                style={styles.locationButton}
              />
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Destination</Text>
          <Input
            label="Destination Location"
            control={control}
            name="destinationLocation"
            placeholder="Enter destination"
            editable={false}
            onPress={() => setShowLocationPicker('destination')}
          />
          {errors.destinationLocation && (
            <Text style={globalStyles.errorText}>{errors.destinationLocation.message}</Text>
          )}

          {showLocationPicker === 'destination' && (
            <View style={styles.locationOptions}>
              <Button
                title="Use City Center"
                onPress={handleSetDestinationLocation}
                variant="primary"
                style={styles.locationButton}
              />
              <Button
                title="Select from Map"
                onPress={handleSetDestinationLocation}
                variant="secondary"
                style={styles.locationButton}
              />
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Route Summary</Text>
          {pickupLocation && destinationLocation ? (
            <View style={styles.summary}>
              <Text style={globalStyles.bodyMedium}>
                <Text style={{ fontWeight: '600' }}>From: </Text>
                {pickupLocation}
              </Text>
              <Text style={[globalStyles.bodyMedium, { marginVertical: 8 }]}>
                <Text style={{ fontWeight: '600' }}>To: </Text>
                {destinationLocation}
              </Text>
            </View>
          ) : (
            <Text style={globalStyles.bodySmall}>Select locations to see route summary</Text>
          )}
        </Card>

        <View style={styles.submitContainer}>
          <Button
            title={isLoading ? 'Creating Request...' : 'Request Ride'}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isLoading}
          />
          {isLoading && <ActivityIndicator color={COLORS.PRIMARY} style={styles.spinner} />}
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
  },
  headerTitle: {
    fontSize: 22,
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
  locationOptions: {
    marginTop: 12,
    gap: 8,
  },
  locationButton: {
    marginVertical: 4,
  },
  summary: {
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  submitContainer: {
    paddingVertical: 24,
    gap: 8,
  },
  spinner: {
    marginTop: 8,
  },
});
