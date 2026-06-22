import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@components/Button';
import Card from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme'
import { createGlobalStyles } from '@styles/globalStyles';

export default function PaymentScreen() {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const globalStyles = createGlobalStyles(colors)
  const router = useRouter();
  const { currentRide, createPayment, updatePaymentStatus, updateRideStatus, isLoading } =
    useRideStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'flutterwave' | 'cash'>('flutterwave');
  const handlePayment = async () => {
    try {
      if (!currentRide?.id || !user?.id) {
        Alert.alert('Error', 'Ride or user information missing');
        return;
      }

      // Create payment record
      await createPayment(currentRide.id, currentRide.agreed_price);

      if (paymentMethod === 'flutterwave') {
        handleFlutterwavePayment();
      } else {
        // Cash payment - mark as pending
        Alert.alert(
          'Inform Driver',
          'Remember to pay the driver ₦' +
          currentRide.agreed_price.toLocaleString() +
          ' in cash when you arrive.'
        );
        await updatePaymentStatus('pending', 'pending', '');
        await updateRideStatus(currentRide.id, 'completed');
        router.replace('/student/history');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    }
  };

  const handleFlutterwavePayment = () => {
    // For production, implement actual Flutterwave integration
    Alert.alert(
      'Flutterwave Payment',
      'In production, this will open Flutterwave checkout.\n\nFor now, payment is marked as successful.'
    );

    // Simulate successful payment
    setTimeout(async () => {
      try {
        if (currentRide?.id) {
          await updatePaymentStatus('paid', 'paid', 'FLW_REF_' + Date.now());
          await updateRideStatus(currentRide.id, 'completed');
          Alert.alert('Payment Successful!', 'Your ride payment has been processed.');
          router.replace('/student/history');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to complete payment');
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Ride Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={globalStyles.bodyMedium}>Pickup:</Text>
            <Text style={globalStyles.bodySmall}>Main Campus Gate</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={globalStyles.bodyMedium}>Destination:</Text>
            <Text style={globalStyles.bodySmall}>City Center</Text>
          </View>

          <View style={[styles.summaryRow, styles.divider]}>
            <Text style={globalStyles.bodyMedium}>Distance:</Text>
            <Text style={globalStyles.bodySmall}>~12 km</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={globalStyles.heading2}>Total Amount:</Text>
            <Text style={styles.totalPrice}>₦{currentRide?.agreed_price.toLocaleString()}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.methodOption, paymentMethod === 'flutterwave' && styles.methodSelected]}
            onPress={() => setPaymentMethod('flutterwave')}
          >
            <View style={styles.methodRadio}>
              {paymentMethod === 'flutterwave' && <View style={styles.methodRadioSelected} />}
            </View>
            <View style={styles.methodContent}>
              <Text style={globalStyles.bodyMedium}>Flutterwave</Text>
              <Text style={globalStyles.bodySmall}>Card, Transfer, Wallet</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodOption, paymentMethod === 'cash' && styles.methodSelected]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.methodRadio}>
              {paymentMethod === 'cash' && <View style={styles.methodRadioSelected} />}
            </View>
            <View style={styles.methodContent}>
              <Text style={globalStyles.bodyMedium}>Cash</Text>
              <Text style={globalStyles.bodySmall}>Pay driver directly</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={globalStyles.heading3}>Payment Details</Text>

          {paymentMethod === 'flutterwave' ? (
            <View>
              <Text style={globalStyles.bodySmall}>
                You will be redirected to Flutterwave to complete your payment securely.
              </Text>
              <Text style={[globalStyles.bodySmall, styles.detailText]}>
                Supported methods: Card, Bank Transfer, Mobile Money, and more.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={globalStyles.bodySmall}>
                You will pay the driver ₦{currentRide?.agreed_price.toLocaleString()} directly when you arrive at your destination.
              </Text>
              <Text style={[globalStyles.bodySmall, styles.detailText]}>
                Make sure to have exact change or ask the driver for change.
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.actionContainer}>
          <Button
            title={isLoading ? 'Processing...' : 'Proceed to Payment'}
            onPress={handlePayment}
            variant="primary"
            disabled={isLoading}
          />
          {isLoading && <ActivityIndicator color={colors.PRIMARY} style={styles.spinner} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.PRIMARY,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.SECONDARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  divider: {
    borderBottomWidth: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.LIGHT_GRAY,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.ACCENT,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  methodSelected: {
    borderColor: colors.PRIMARY,
    backgroundColor: 'rgba(0, 87, 217, 0.05)',
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.GRAY,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.PRIMARY,
  },
  methodContent: {
    flex: 1,
  },
  detailText: {
    marginTop: 8,
  },
  actionContainer: {
    paddingVertical: 24,
    gap: 8,
  },
  spinner: {
    marginTop: 8,
  },
});
