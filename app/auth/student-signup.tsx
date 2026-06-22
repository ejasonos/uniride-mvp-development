import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  const globalStyles = createGlobalStyles(colors)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email) {
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
      newErrors.password = 'Password must be at least 6 characters';
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
      await signUp(email, password, fullName, phone, 'student');

      Alert.alert(
        "Verify your email",
        "We sent a confirmation link to your email. Please verify before logging in."
      );

      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Unable to create account.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Student Account</Text>
          <Text style={styles.subtitle}>Join UniRide as a student</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="University Email"
            placeholder="john.doe@university.edu"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            variant="secondary"
            style={styles.signInButton}
            textStyle={styles.signInText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    header: {
      marginBottom: 24,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginVertical: 8,
    },
    button: {
      marginVertical: 16,
      marginHorizontal: 0,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 24,
      paddingBottom: 24,
    },
    footerText: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
    },
    signInButton: {
      paddingVertical: 0,
      paddingHorizontal: 10,
      marginVertical: 0,
    },
    signInText: {
      fontSize: 14,
      color: colors.PRIMARY,
    },
  });
