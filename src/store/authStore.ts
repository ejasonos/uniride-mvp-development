import { create } from 'zustand';
import { Profile } from '@types/index';
import * as authService from '@services/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: 'student' | 'driver',
    additionalData?: {
      vehicle_type?: string;
      vehicle_registration?: string;
      university_id?: string;
    }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: Profile | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  isInitialized: false,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      // Check current session
      const { session } = await authService.getCurrentSession();

      if (session?.user) {
        // Get user profile
        const { profile } = await authService.getProfile(session.user.id);
        set({ user: profile, isLoading: false, isInitialized: true });
      } else {
        set({ user: null, isLoading: false, isInitialized: true });
      }
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to initialize auth',
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  signUp: async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: 'student' | 'driver',
    additionalData
  ) => {
    try {
      set({ isLoading: true, error: null });

      const { user, error } = await authService.signUp(
        email,
        password,
        fullName,
        phone,
        role,
        additionalData
      );

      if (error) throw error;

      // Get profile
      const { profile } = await authService.getProfile(user!.id);
      set({ user: profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Sign up failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { user, error } = await authService.signIn(email, password);

      if (error) throw error;

      // Get profile
      const { profile } = await authService.getProfile(user!.id);
      set({ user: profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Sign in failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      await authService.signOut();
      await AsyncStorage.removeItem('user');

      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Sign out failed',
        isLoading: false,
      });
    }
  },

  setUser: (user: Profile | null) => {
    set({ user });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
