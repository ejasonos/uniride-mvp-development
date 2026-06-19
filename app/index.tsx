import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '../src/screens/SplashScreen';
import { useAuthStore } from '../src/store/authStore';

export default function IndexRoute() {
  const router = useRouter();
  const { user, isInitialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    router.replace(user.role === 'student' ? '/student' : '/driver');
  }, [isInitialized, router, user]);

  return <SplashScreen />;
}