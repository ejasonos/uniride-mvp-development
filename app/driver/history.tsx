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
import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@styles/globalStyles';

export default function DriverHistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { rides, isLoading, fetchDriverRideHistory } = useRideStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors)

  useEffect(() => {
    if (user?.id) {
      fetchDriverRideHistory(user.id);
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    if (user?.id) {
      setRefreshing(true);
      await fetchDriverRideHistory(user.id);
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

  const calculateEarnings = () => {
    return rides
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + (r.agreed_price || 0), 0);
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
        <Text style={globalStyles.bodyMedium}>Amount Earned:</Text>
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
          title="Go Online"
          onPress={() => router.replace('/driver')}
          variant="secondary"
        />
      </View>

      {isLoading && rides.length === 0 ? (
        <View style={[globalStyles.columnCenter, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
          <Text style={[globalStyles.bodyMedium, styles.loadingText]}>Loading rides...</Text>
        </View>
      ) : (
        <>
          {rides.length > 0 && (
            <Card style={[styles.statsCard, styles.statsMargin]}>
              <View style={globalStyles.rowBetween}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Rides</Text>
                  <Text style={styles.statValue}>{rides.length}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Completed</Text>
                  <Text style={styles.statValue}>
                    {rides.filter((r) => r.status === 'completed').length}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Earnings</Text>
                  <Text style={styles.statValue}>₦{calculateEarnings().toLocaleString()}</Text>
                </View>
              </View>
            </Card>
          )}

          {rides.length === 0 ? (
            <View style={[globalStyles.columnCenter, styles.centerContent]}>
              <Text style={globalStyles.heading3}>No rides yet</Text>
              <Text style={[globalStyles.bodySmall, styles.emptyText]}>
                Start accepting ride requests to build your history
              </Text>
              <Button
                title="Go Online"
                onPress={() => router.replace('/driver')}
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
        </>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
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
    statsCard: {
      marginBottom: 0,
      borderRadius: 0,
      marginHorizontal: -16,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(0, 87, 217, 0.05)',
    },
    statsMargin: {
      marginVertical: 16,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.GRAY,
    },
    statLabel: {
      fontSize: 12,
      color: colors.TEXT_SECONDARY,
      fontWeight: '600',
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.PRIMARY,
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
    }
  });
