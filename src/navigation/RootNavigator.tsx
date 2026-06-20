import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Screens
import { SplashScreen } from '@screens/SplashScreen';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { SignUpRoleScreen } from '@screens/auth/SignUpRoleScreen';
import { StudentSignUpScreen } from '@screens/auth/StudentSignUpScreen';
import { DriverSignUpScreen } from '@screens/auth/DriverSignUpScreen';
import { StudentHomeScreen } from '@screens/student/StudentHomeScreen';
import { RideRequestScreen } from '@screens/student/RideRequestScreen';
import { RideOffersScreen } from '@screens/student/RideOffersScreen';
import { NegotiationChatScreen } from '@screens/student/NegotiationChatScreen';
import { RideTrackingScreen } from '@screens/student/RideTrackingScreen';
import { PaymentScreen } from '@screens/student/PaymentScreen';
import { RideHistoryScreen } from '@screens/student/RideHistoryScreen';
import { DriverHomeScreen } from '@screens/driver/DriverHomeScreen';
import { SubmitOfferScreen } from '@screens/driver/SubmitOfferScreen';
import { DriverHistoryScreen } from '@screens/driver/DriverHistoryScreen';

// Stores
import { useAuthStore } from '@store/authStore';

// Constants
import { COLORS } from '@constants/index';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUpRole" component={SignUpRoleScreen} />
      <Stack.Screen name="StudentSignUp" component={StudentSignUpScreen} />
      <Stack.Screen name="DriverSignUp" component={DriverSignUpScreen} />
    </Stack.Navigator>
  );
};

const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
      <Stack.Screen name="RideRequest" component={RideRequestScreen} />
      <Stack.Screen name="RideOffers" component={RideOffersScreen} />
      <Stack.Screen name="NegotiationChat" component={NegotiationChatScreen} />
      <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
    </Stack.Navigator>
  );
};

const DriverStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
      <Stack.Screen name="SubmitOffer" component={SubmitOfferScreen} />
      <Stack.Screen name="DriverHistory" component={DriverHistoryScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'student' ? (
        <StudentStack />
      ) : (
        <DriverStack />
      )}
    </NavigationContainer>
  );
};
