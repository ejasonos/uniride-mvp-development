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
import { useRouter } from 'expo-router';
import Button from '@components/Button';
import Input from '@components/Input';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@/styles/globalStyles';

export default function StudentSignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        'student'
      );

      Alert.alert(
        'Verify your email',
        'A verification link has been sent to your inbox.'
      );

      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Unable to create account'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}

        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>STUDENT ACCOUNT</Text>
          </View>

          <Text style={styles.title}>
            Join UniRide
          </Text>

          <Text style={styles.subtitle}>
            Request rides, negotiate fares, and travel safely around campus.
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressActive} />
            <View style={styles.progressInactive} />
          </View>

          <Text style={styles.progressText}>
            Step 1 of 2
          </Text>
        </View>

        {/* Form Card */}

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
            Create your account
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

          <View style={styles.securityBox}>
            <Text style={styles.securityTitle}>
              Secure Account
            </Text>

            <Text style={styles.securityText}>
              Use at least 8 characters with a mix of letters and numbers.
            </Text>
          </View>

          <Button
            title={
              isLoading
                ? 'Creating Account...'
                : 'Create Student Account'
            }
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            style={styles.ctaButton}
          />
        </View>

        {/* Footer */}

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: colors.TEXT_SECONDARY },
            ]}
          >
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
          >
            <Text
              style={[
                styles.signInText,
                { color: colors.PRIMARY },
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
      marginBottom: 32,
      alignItems: 'center',
    },

    badge: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: `${colors.PRIMARY}15`,
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
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 320,
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

    progressInactive: {
      width: 60,
      height: 6,
      borderRadius: 10,
      backgroundColor: colors.BORDER,
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
      marginBottom: 32,

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

    securityBox: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      marginTop: 8,
      marginBottom: 24,
    },

    securityTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 4,
    },

    securityText: {
      fontSize: 13,
      color: colors.TEXT_SECONDARY,
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
    },

    footerText: {
      fontSize: 15,
    },

    signInText: {
      fontSize: 15,
      fontWeight: '700',
    },
  });