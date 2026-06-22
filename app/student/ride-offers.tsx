import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@components/Button';
import Card from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useTheme } from '@hooks/useTheme'
import { globalStyles } from '@styles/globalStyles'

export default function RideOffersScreen() {
  const router = useRouter();
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const { rideRequestId } = useLocalSearchParams<{ rideRequestId?: string | string[] }>();
  const resolvedRideRequestId = Array.isArray(rideRequestId) ? rideRequestId[0] : rideRequestId;
  const { currentRideRequest, rideOffers, isLoading, fetchRideOffers } = useRideStore();
  useEffect(() => {
    const requestId = resolvedRideRequestId || currentRideRequest?.id;

    if (requestId) {
      fetchRideOffers(requestId);
      const interval = setInterval(() => {
        fetchRideOffers(requestId);
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentRideRequest?.id, resolvedRideRequestId]);

  const handleSelectOffer = (offerId: string) => {
    router.push({
      pathname: '/student/negotiation-chat',
      params: { rideOfferId: offerId },
    });
  };

  const renderOfferCard = ({ item }: any) => (
    <Card style={styles.offerCard}>
      <View style={globalStyles.rowBetween}>
        <Text style={globalStyles.heading3}>Driver Offer</Text>
        <Text style={styles.price}>₦{item.offered_price.toLocaleString()}</Text>
      </View>

      <View style={styles.divider} />

      {item.message && (
        <View style={styles.messageContainer}>
          <Text style={globalStyles.bodySmall}>Message from driver:</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      )}

      <View style={[globalStyles.rowBetween, styles.buttonContainer]}>
        <Button
          title="View Details"
          onPress={() => handleSelectOffer(item.id)}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Chat"
          onPress={() => handleSelectOffer(item.id)}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </Card>
  );

  if (isLoading && rideOffers.length === 0) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Offers</Text>
        </View>
        <View style={[globalStyles.columnCenter, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
          <Text style={[globalStyles.bodyMedium, styles.loadingText]}>Waiting for offers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Offers ({rideOffers.length})</Text>
      </View>

      <View style={styles.content}>
        {rideOffers.length === 0 ? (
          <View style={[globalStyles.columnCenter, styles.centerContent]}>
            <Text style={globalStyles.bodyMedium}>No offers yet</Text>
            <Text style={globalStyles.bodySmall}>Drivers will see your request shortly</Text>
            <ActivityIndicator color={colors.PRIMARY} style={styles.spinner} />
          </View>
        ) : (
          <FlatList
            data={rideOffers}
            keyExtractor={(item) => item.id}
            renderItem={renderOfferCard}
            scrollEnabled={false}
            onEndReachedThreshold={0.8}
          />
        )}
      </View>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerCard: {
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ACCENT,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY,
    marginVertical: 12,
  },
  messageContainer: {
    marginBottom: 12,
    backgroundColor: colors.LIGHT_GRAY,
    padding: 10,
    borderRadius: 6,
  },
  message: {
    marginTop: 6,
    color: colors.TEXT_PRIMARY,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
  },
  spinner: {
    marginTop: 16,
  },
});
