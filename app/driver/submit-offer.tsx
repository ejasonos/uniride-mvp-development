import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Card } from '@components/Card';
import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useChatStore } from '@store/chatStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

const offerSchema = z.object({
  offeredPrice: z.string().transform((v) => parseFloat(v)).refine((v) => v > 0, 'Price must be greater than 0'),
  message: z.string().optional(),
});

type OfferForm = z.infer<typeof offerSchema>;

export default function SubmitOfferScreen() {
  const router = useRouter();
  const { rideRequestId } = useLocalSearchParams<{ rideRequestId?: string | string[] }>();
  const resolvedRideRequestId = Array.isArray(rideRequestId) ? rideRequestId[0] : rideRequestId;
  const { user } = useAuthStore();
  const { createRideOffer, isLoading, rideRequests } = useRideStore();
  const { createConversation } = useChatStore();
  const [estimatedPrice, setEstimatedPrice] = useState('500');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      offeredPrice: '500',
      message: '',
    },
  });

  const currentRequest = rideRequests.find((r) => r.id === resolvedRideRequestId);
  const message = watch('message');
  const offeredPrice = watch('offeredPrice');

  const onSubmit = async (data: OfferForm) => {
    try {
      if (!resolvedRideRequestId) {
        Alert.alert('Error', 'Ride request not found');
        return;
      }

      if (!user?.id) {
        Alert.alert('Error', 'Driver information not found');
        return;
      }

      // Create conversation first
      await createConversation(resolvedRideRequestId, currentRequest?.student_id || '', user.id);

      // Then create offer
      await createRideOffer(
        resolvedRideRequestId,
        user.id,
        data.offeredPrice,
        data.message || undefined
      );

      Alert.alert('Success', 'Offer submitted! Waiting for student response.');
      router.replace('/driver');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit offer');
    }
  };

  const handleQuickPrice = (price: number) => {
    setEstimatedPrice(price.toString());
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Submit Your Offer</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Ride Details</Text>

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodySmall}>
              <Text style={{ fontWeight: '600' }}>Pickup: </Text>
              Main Campus Gate
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodySmall}>
              <Text style={{ fontWeight: '600' }}>Destination: </Text>
              City Center
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={globalStyles.bodySmall}>
              <Text style={{ fontWeight: '600' }}>Distance: </Text>
              ~12 km
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Your Offer Price</Text>
          <Text style={globalStyles.bodySmall}>Set a competitive price to win this ride</Text>

          <Input
            label="Offered Price (NGN)"
            control={control}
            name="offeredPrice"
            placeholder="e.g., 500"
            keyboardType="decimal-pad"
            style={styles.priceInput}
          />
          {errors.offeredPrice && (
            <Text style={globalStyles.errorText}>{errors.offeredPrice.message}</Text>
          )}

          <View style={styles.suggestedPrices}>
            <Text style={globalStyles.bodySmall}>Suggested prices:</Text>
            <View style={styles.priceButtonsRow}>
              <Button
                title="400"
                onPress={() => handleQuickPrice(400)}
                variant={offeredPrice === '400' ? 'primary' : 'secondary'}
                style={styles.priceButton}
              />
              <Button
                title="500"
                onPress={() => handleQuickPrice(500)}
                variant={offeredPrice === '500' ? 'primary' : 'secondary'}
                style={styles.priceButton}
              />
              <Button
                title="600"
                onPress={() => handleQuickPrice(600)}
                variant={offeredPrice === '600' ? 'primary' : 'secondary'}
                style={styles.priceButton}
              />
              <Button
                title="700"
                onPress={() => handleQuickPrice(700)}
                variant={offeredPrice === '700' ? 'primary' : 'secondary'}
                style={styles.priceButton}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Message to Student (Optional)</Text>
          <Text style={globalStyles.bodySmall}>
            Add a message to negotiate or provide details about your vehicle
          </Text>

          <Input
            label="Message"
            control={control}
            name="message"
            placeholder="e.g., I have a clean Toyota Camry, very safe driver"
            multiline={true}
            numberOfLines={4}
            style={styles.messageInput}
          />

          <Text style={[globalStyles.bodySmall, styles.charCount]}>
            {message?.length || 0}/200 characters
          </Text>
        </Card>

        <Card style={styles.priceCard}>
          <View style={globalStyles.rowBetween}>
            <Text style={globalStyles.heading3}>Your Price:</Text>
            <Text style={styles.finalPrice}>₦{offeredPrice || '0'}</Text>
          </View>
        </Card>

        <View style={styles.actionContainer}>
          <Button
            title={isLoading ? 'Submitting...' : 'Submit Offer'}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isLoading}
          />
          {isLoading && <ActivityIndicator color={COLORS.PRIMARY} style={styles.spinner} />}

          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.cancelButton}
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
  detailRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  priceInput: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  suggestedPrices: {
    marginVertical: 12,
  },
  priceButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  priceButton: {
    flex: 1,
  },
  messageInput: {
    marginVertical: 12,
    minHeight: 100,
  },
  charCount: {
    marginTop: 6,
    textAlign: 'right',
    color: COLORS.TEXT_SECONDARY,
  },
  priceCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  actionContainer: {
    paddingVertical: 24,
    gap: 12,
  },
  spinner: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});
