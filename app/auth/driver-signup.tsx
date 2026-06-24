import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import Button from '@components/Button';
import Input from '@components/Input';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme';
import { VEHICLE_TYPES } from '@constants/index';
import { createGlobalStyles } from '@styles/globalStyles';

export default function DriverSignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleType, setVehicleType] = useState<string>(
    VEHICLE_TYPES[0]
  );
  const [vehicleRegistration, setVehicleRegistration] =
    useState('');
  const [universityId, setUniversityId] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>(
    {}
  );

  const { signUp, isLoading } = useAuthStore();

  const { colors } = useTheme();
  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!vehicleRegistration.trim()) {
      newErrors.vehicleRegistration =
        'Vehicle registration is required';
    }

    if (!universityId.trim()) {
      newErrors.universityId =
        'University ID is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(
        email,
        password,
        fullName,
        phone,
        'driver',
        {
          vehicle_type: vehicleType,
          vehicle_registration: vehicleRegistration,
          university_id: universityId,
        }
      );

      Alert.alert(
        'Account Created',
        'Your driver account has been created successfully.'
      );

      router.replace('/driver');
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message ||
          'Unable to create account. Please try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              DRIVER PARTNER
            </Text>
          </View>

          <Text style={styles.title}>
            Drive with UniRide
          </Text>

          <Text style={styles.subtitle}>
            Earn money by helping students move
            around campus safely and conveniently.
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressActive} />
            <View style={styles.progressActive} />
          </View>

          <Text style={styles.progressText}>
            Step 2 of 2
          </Text>
        </View>

        {/* MAIN CARD */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.CARD,
              borderColor: colors.BORDER,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            Driver Information
          </Text>

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            containerStyle={styles.input}
          />

          <Input
            label="University Email"
            placeholder="john@university.edu"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.input}
          />

          <Input
            label="Phone Number"
            placeholder="+234 800 000 0000"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
            containerStyle={styles.input}
          />

          <Text style={styles.inputLabel}>
            Vehicle Type
          </Text>

          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor:
                  colors.BACKGROUND_SECONDARY,
                borderColor: colors.BORDER,
              },
            ]}
          >
            <Picker
              selectedValue={vehicleType}
              onValueChange={(value) =>
                setVehicleType(value as string)
              }
              dropdownIconColor={colors.TEXT_PRIMARY}
              style={{
                color: colors.TEXT_PRIMARY,
              }}
            >
              {VEHICLE_TYPES.map((type) => (
                <Picker.Item
                  key={type}
                  label={type}
                  value={type}
                />
              ))}
            </Picker>
          </View>

          <Input
            label="Vehicle Registration"
            placeholder="ABC-123XYZ"
            value={vehicleRegistration}
            onChangeText={setVehicleRegistration}
            error={errors.vehicleRegistration}
            autoCapitalize="characters"
            containerStyle={styles.input}
          />

          <Input
            label="University ID"
            placeholder="202500123"
            value={universityId}
            onChangeText={setUniversityId}
            error={errors.universityId}
            containerStyle={styles.input}
          />

          <Input
            label="Password"
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            containerStyle={styles.input}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
            containerStyle={styles.input}
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Driver Verification
            </Text>

            <Text style={styles.infoText}>
              • Verified university identity
            </Text>

            <Text style={styles.infoText}>
              • Vehicle registration required
            </Text>

            <Text style={styles.infoText}>
              • Secure rider-driver matching
            </Text>

            <Text style={styles.infoText}>
              • Flexible earning opportunities
            </Text>
          </View>

          <Button
            title={
              isLoading
                ? 'Creating Driver Account...'
                : 'Become a Driver'
            }
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            style={styles.ctaButton}
          />
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color:
                  colors.TEXT_SECONDARY,
              },
            ]}
          >
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push('/auth/login')
            }
          >
            <Text
              style={[
                styles.signInText,
                {
                  color: colors.PRIMARY,
                },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40,
    },

    hero: {
      alignItems: 'center',
      marginBottom: 32,
    },

    badge: {
      backgroundColor: `${colors.PRIMARY}15`,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 20,
    },

    badgeText: {
      color: colors.PRIMARY,
      fontWeight: '700',
      fontSize: 12,
      letterSpacing: 1,
    },

    title: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      textAlign: 'center',
      marginBottom: 10,
    },

    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.TEXT_SECONDARY,
      lineHeight: 24,
      maxWidth: 330,
    },

    progressContainer: {
      flexDirection: 'row',
      marginTop: 24,
      gap: 8,
    },

    progressActive: {
      width: 60,
      height: 6,
      borderRadius: 10,
      backgroundColor: colors.PRIMARY,
    },

    progressText: {
      marginTop: 10,
      color: colors.TEXT_SECONDARY,
      fontSize: 13,
    },

    card: {
      borderWidth: 1,
      borderRadius: 28,
      padding: 24,

      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 10,
      },

      elevation: 4,
    },

    sectionTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 20,
    },

    input: {
      marginBottom: 12,
    },

    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginBottom: 8,
      marginTop: 4,
    },

    pickerContainer: {
      borderWidth: 1,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
    },

    infoCard: {
      marginTop: 12,
      marginBottom: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor:
        colors.BACKGROUND_SECONDARY,
    },

    infoTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 8,
    },

    infoText: {
      fontSize: 13,
      color: colors.TEXT_SECONDARY,
      marginBottom: 4,
      lineHeight: 20,
    },

    ctaButton: {
      height: 58,
      borderRadius: 16,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 24,
    },

    footerText: {
      fontSize: 15,
    },

    signInText: {
      fontSize: 15,
      fontWeight: '700',
    },
  });