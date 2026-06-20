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
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { useAuthStore } from '@store/authStore';
import { globalStyles } from '@styles/index';
import { COLORS, VEHICLE_TYPES } from '@constants/index';

export default function DriverSignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleType, setVehicleType] = useState<string>(VEHICLE_TYPES[0]);
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, isLoading } = useAuthStore();

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

    if (!vehicleRegistration.trim()) {
      newErrors.vehicleRegistration = 'Vehicle registration is required';
    }

    if (!universityId.trim()) {
      newErrors.universityId = 'University ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(email, password, fullName, phone, 'driver', {
        vehicle_type: vehicleType,
        vehicle_registration: vehicleRegistration,
        university_id: universityId,
      });
      router.replace('/driver');
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Unable to create account. Please try again.');
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
          <Text style={styles.title}>Become a Driver</Text>
          <Text style={styles.subtitle}>Join UniRide as a driver and earn money</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Vehicle Type</Text>
            <Picker
              selectedValue={vehicleType}
              onValueChange={(itemValue) => setVehicleType(itemValue as string)}
              style={styles.picker}
            >
              {VEHICLE_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <Input
            label="Vehicle Registration"
            placeholder="ABC-123456"
            value={vehicleRegistration}
            onChangeText={setVehicleRegistration}
            error={errors.vehicleRegistration}
            autoCapitalize="characters"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="University ID Number"
            placeholder="1234567"
            value={universityId}
            onChangeText={setUniversityId}
            error={errors.universityId}
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
            title="Create Driver Account"
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

const styles = StyleSheet.create({
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
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: COLORS.SECONDARY,
    color: COLORS.TEXT_PRIMARY,
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
    color: COLORS.TEXT_SECONDARY,
  },
  signInButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  signInText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
});
