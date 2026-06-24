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
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@components/Button';
import Input from '@components/Input';
import { useAuthStore } from '@store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@hooks/useTheme';
import { createGlobalStyles } from '@/styles/globalStyles';

export default function LoginScreeen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, isLoading } = useAuthStore();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const globalStyles = createGlobalStyles(colors)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      // await signIn(email, password);
      console.log("signin successful")
      router.replace('/student');
    } catch (error: any) {
      const msg = error.message;

      if (msg.includes("confirm")) {
        Alert.alert(
          "Email not verified",
          "Please check your inbox and confirm your email before logging in."
        );
        return;
      }

      Alert.alert("Login Failed", msg);
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
          <Text style={styles.title}>Welcome Back</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemeToggle />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.subtitle}>Sign in to your UniRide account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your.email@university.edu"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Button
            title="Sign Up"
            onPress={() => router.push('/auth/signup-role')}
            variant="secondary"
            style={styles.signUpButton}
            textStyle={styles.signUpText}
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
      justifyContent: 'center',
    },
    header: {
      marginBottom: 32,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
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
    },
    footerText: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
    },
    signUpButton: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      marginVertical: 0,
    },
    signUpText: {
      fontSize: 14,
      color: colors.PRIMARY,
    },
  });
