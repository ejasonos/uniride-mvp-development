import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@/styles/globalStyles';
import ThemeToggle from '@/components/ThemeToggle';

export default function SignUpRoleScreen() {
  const router = useRouter();

  const { colors } = useTheme();

  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors);

  return (
    <>
      <StatusBar barStyle="light-content" />

      <View style={globalStyles.container}>
        <LinearGradient
          colors={[colors.PRIMARY, '#003EA5']}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <ThemeToggle />
          </View>

          <Text style={styles.heroTitle}>
            Join UniRide
          </Text>

          <Text style={styles.heroSubtitle}>
            Campus transportation
            {'\n'}
            made simple.
          </Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Student Card */}

          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() =>
              router.push('/auth/student-signup')
            }
          >
            <View style={styles.roleCard}>
              <View
                style={styles.arrangeFlat}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="school-outline"
                    size={38}
                    color={colors.PRIMARY}
                  />
                </View>
                <View style={styles.roleTextStyle}>
                  <Text style={styles.roleTitle}>
                    Student
                  </Text>

                  <Text style={styles.roleDescription}>
                    Request rides around campus
                    quickly, safely, and affordably.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <Text style={styles.feature}>
                  ✓ Find rides instantly
                </Text>

                <Text style={styles.feature}>
                  ✓ Negotiate fares
                </Text>

                <Text style={styles.feature}>
                  ✓ Track rides live
                </Text>
              </View>

              <Ionicons
                name="arrow-forward-circle"
                size={34}
                color={colors.PRIMARY}
                style={styles.arrow}
              />
            </View>
          </TouchableOpacity>

          {/* Driver Card */}

          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() =>
              router.push('/auth/driver-signup')
            }
          >
            <View style={styles.roleCard}>
              <View
                  style={styles.arrangeFlat}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="car-sport-outline"
                    size={38}
                    color={colors.PRIMARY}
                  />
                </View>
                <View style={styles.roleTextStyle}>
                  <Text style={styles.roleTitle}>
                    Driver
                  </Text>

                  <Text style={styles.roleDescription}>
                    Earn money by helping students
                    move around campus.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <Text style={styles.feature}>
                  ✓ Earn on your schedule
                </Text>

                <Text style={styles.feature}>
                  ✓ Accept preferred rides
                </Text>

                <Text style={styles.feature}>
                  ✓ Manage offers easily
                </Text>
              </View>

              <Ionicons
                name="arrow-forward-circle"
                size={34}
                color={colors.PRIMARY}
                style={styles.arrow}
              />
            </View>
          </TouchableOpacity>

          {/* Trust Section */}

          <View style={styles.trustContainer}>
            <View style={styles.trustItem}>
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#16A34A"
              />

              <Text style={styles.trustText}>
                Verified Students
              </Text>
            </View>

            <View style={styles.trustItem}>
              <Ionicons
                name="car"
                size={18}
                color="#16A34A"
              />

              <Text style={styles.trustText}>
                Trusted Drivers
              </Text>
            </View>

            <View style={styles.trustItem}>
              <Ionicons
                name="lock-closed"
                size={18}
                color="#16A34A"
              />

              <Text style={styles.trustText}>
                Secure Platform
              </Text>
            </View>
          </View>

          {/* Footer */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push('/auth/login')
              }
            >
              <Text style={styles.signInText}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    hero: {
      height: 240,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },

    heroTop: {
      position: 'absolute',
      right: 20,
      top: 60,
    },

    heroTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      opacity: 0.9,
    },

    heroSubtitle: {
      fontSize: 36,
      fontWeight: '800',
      color: '#FFFFFF',
      marginTop: 10,
      lineHeight: 42,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40
    },

    roleCard: {
      width: '100%',
      backgroundColor: colors.BACKGROUND,
      borderRadius: 15,
      padding: 15,
      marginBottom: 18,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 10,
    },

    arrangeFlat: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: 8
    },

    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 22,

      backgroundColor: 'rgba(0,87,217,0.08)',

      justifyContent: 'center',
      alignItems: 'center',

      marginBottom: 20,
    },
    roleTextStyle: {
      width: "100%"
    },
    roleTitle: {
      fontSize: 25,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },

    roleDescription: {
      fontSize: 12,
      width: "80%",
      color: colors.TEXT_SECONDARY,
      lineHeight: 12,

    },

    featureContainer: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.GRAY,
    },

    feature: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
      marginBottom: 10,
      fontWeight: '500',
    },

    arrow: {
      alignSelf: 'flex-end',
      marginTop: 10,
    },

    trustContainer: {
      marginTop: 12,
      marginBottom: 28,
      gap: 12,
    },

    trustItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    trustText: {
      marginLeft: 10,
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },

    footerText: {
      color: colors.TEXT_SECONDARY,
      fontSize: 14,
    },

    signInText: {
      color: colors.PRIMARY,
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 6,
    },
  });