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
import { useRouter } from 'expo-router';
import Button from '@components/Button';
import Card from '@components/Card';
import { useRideStore } from '@store/rideStore';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme'
import { globalStyles } from '@styles/globalStyles'

export default function RideHistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { rides, isLoading, fetchStudentRideHistory } = useRideStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useTheme()
  const styles = createStyles(colors)

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
        return colors.SUCCESS || '#4CAF50';
      case 'in_progress':
        return colors.ACCENT;
      case 'cancelled':
        return colors.ERROR || '#f44336';
      default:
        return colors.GRAY;
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

      <View style={[globalStyles.rowBetween, styles.priceRow]}>
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
          onPress={() => router.push('/student/ride-request')}
          variant="secondary"
        />
      </View>

      {isLoading && rides.length === 0 ? (
        <View style={[globalStyles.columnCenter, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
          <Text style={[globalStyles.bodyMedium, styles.loadingText]}>Loading rides...</Text>
        </View>
      ) : rides.length === 0 ? (
        <View style={[globalStyles.columnCenter, styles.centerContent]}>
          <Text style={globalStyles.heading3}>No rides yet</Text>
          <Text style={[globalStyles.bodySmall, styles.emptyText]}>
            Request a ride to get started
          </Text>
          <Button
            title="Request a Ride"
            onPress={() => router.push('/student/ride-request')}
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
              colors={[colors.PRIMARY]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.SECONDARY,
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
    color: colors.SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY,
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
    color: colors.ACCENT,
  },
  detailsButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },
  emptyText: {
    marginVertical: 12,
  },
  emptyButton: {
    marginTop: 20,
  },
});
