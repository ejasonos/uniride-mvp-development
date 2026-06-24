import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '@components/Button';
import Input from '@components/Input';

import { useAuthStore } from '@store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@/styles/globalStyles';
import { BRAND } from '@/constants/branding';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, isLoading } = useAuthStore();

  const { colors } = useTheme();

  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await signIn(email, password);

      console.log('signin successful');

      router.replace('/student');
    } catch (error: any) {
      const msg = error.message;

      if (msg.includes('confirm')) {
        Alert.alert(
          'Email not verified',
          'Please verify your email before logging in.'
        );

        return;
      }

      Alert.alert('Login Failed', msg);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={[colors.PRIMARY, '#003EA5']}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <ThemeToggle />
          </View>

          <View style={styles.logoCircle}>
            <Ionicons
              name="car-sport"
              size={34}
              color="#fff"
            />
          </View>

          <Text style={styles.brandName}>
            {BRAND.APP_NAME}
          </Text>

          <Text style={styles.tagline}>
            {BRAND.TAGLINE}
          </Text>
        </LinearGradient>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.heading}>
              Welcome Back
            </Text>

            <Text style={styles.subHeading}>
              Sign in and continue your journey
            </Text>

            <Input
              label="Email"
              placeholder="student@university.edu"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              // loading={isLoading}
              // disabled={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>
                OR
              </Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color={colors.TEXT_PRIMARY}
              />

              <Text style={styles.googleText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push('/auth/signup-role')
                }
              >
                <Text style={styles.signUpText}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.securityRow}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={colors.SUCCESS}
            />

            <Text style={styles.securityText}>
              Secure campus transportation platform
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    hero: {
      height: 280,
      paddingHorizontal: 24,
      paddingTop: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    },

    heroTop: {
      position: 'absolute',
      right: 20,
      top: 60,
    },

    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },

    brandName: {
      color: '#fff',
      fontSize: 34,
      fontWeight: '800',
    },

    tagline: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 15,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40
    },

    card: {
      backgroundColor: colors.BACKGROUND,
      borderRadius: 28,
      padding: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 10,
      },

      elevation: 8,
    },

    heading: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },

    subHeading: {
      fontSize: 15,
      color: colors.TEXT_SECONDARY,
      marginTop: 6,
      marginBottom: 24,
    },

    inputContainer: {
      marginBottom: 12,
    },

    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 20,
    },

    forgotPasswordText: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },

    loginButton: {
      borderRadius: 16,
      height: 58,
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: '#E5E7EB',
    },

    dividerText: {
      marginHorizontal: 12,
      color: colors.TEXT_SECONDARY,
      fontWeight: '600',
    },

    googleButton: {
      height: 58,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },

    googleText: {
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 28,
    },

    footerText: {
      color: colors.TEXT_SECONDARY,
    },

    signUpText: {
      color: colors.PRIMARY,
      fontWeight: '700',
      marginLeft: 6,
    },

    securityRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 18,
    },

    securityText: {
      fontSize: 12,
      color: colors.TEXT_SECONDARY,
    },
  });