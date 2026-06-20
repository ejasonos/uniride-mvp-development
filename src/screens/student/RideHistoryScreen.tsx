import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useAuthStore } from '@store/authStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export const RideHistoryScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { rides, isLoading, fetchStudentRideHistory } = useRideStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStudentRideHistory(user.id);
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    if (user?.id) {
      setRefreshing(true);
      await fetchStudentRideHistory(user.id);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.SUCCESS || '#4CAF50';
      case 'in_progress':
        return COLORS.ACCENT;
      case 'cancelled':
        return COLORS.ERROR || '#f44336';
      default:
        return COLORS.GRAY;
    }
  };

  const renderRideCard = ({ item }: any) => (
    <Card style={styles.rideCard}>
      <View style={globalStyles.rowBetween}>
        <View style={styles.rideInfo}>
          <Text style={globalStyles.heading3}>
            {item.id.substring(0, 8).toUpperCase()}
          </Text>
          <Text style={globalStyles.bodySmall}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.routeInfo}>
        <Text style={globalStyles.bodySmall}>
          <Text style={{ fontWeight: '600' }}>From: </Text>
          Main Campus Gate
        </Text>
        <Text style={[globalStyles.bodySmall, styles.routeMargin]}>
          <Text style={{ fontWeight: '600' }}>To: </Text>
          City Center
        </Text>
      </View>

      <View style={globalStyles.rowBetween} style={styles.priceRow}>
        <Text style={globalStyles.bodyMedium}>Amount Paid:</Text>
        <Text style={styles.price}>₦{item.agreed_price.toLocaleString()}</Text>
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
        <Button
          title="Request New"
          onPress={() => navigation.navigate('RideRequest')}
          variant="secondary"
        />
      </View>

      {isLoading && rides.length === 0 ? (
        <View style={globalStyles.columnCenter} style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={[globalStyles.bodyMedium, styles.loadingText]}>Loading rides...</Text>
        </View>
      ) : rides.length === 0 ? (
        <View style={globalStyles.columnCenter} style={styles.centerContent}>
          <Text style={globalStyles.heading3}>No rides yet</Text>
          <Text style={[globalStyles.bodySmall, styles.emptyText]}>
            Request a ride to get started
          </Text>
          <Button
            title="Request a Ride"
            onPress={() => navigation.navigate('RideRequest')}
            variant="primary"
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={renderRideCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.PRIMARY]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rideCard: {
    marginBottom: 12,
  },
  rideInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY,
    marginVertical: 12,
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeMargin: {
    marginTop: 4,
  },
  priceRow: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  detailsButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  emptyText: {
    marginVertical: 12,
  },
  emptyButton: {
    marginTop: 20,
  },
});
