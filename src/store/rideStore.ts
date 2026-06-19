import { create } from 'zustand';
import { RideRequest, RideOffer, Ride, Payment } from '@types/index';
import * as rideService from '@services/supabase/rides';

interface RideState {
  currentRide: Ride | null;
  currentRideRequest: RideRequest | null;
  rideRequests: RideRequest[];
  rideOffers: RideOffer[];
  rides: Ride[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;

  // Ride Request Actions
  createRideRequest: (
    studentId: string,
    pickupLocation: string,
    pickupLat: number,
    pickupLng: number,
    destinationLocation: string,
    destinationLat: number,
    destinationLng: number
  ) => Promise<void>;
  fetchPendingRideRequests: () => Promise<void>;
  setCurrentRideRequest: (rideRequest: RideRequest | null) => void;
  updateRideRequestStatus: (rideRequestId: string, status: string) => Promise<void>;

  // Ride Offer Actions
  createRideOffer: (
    rideRequestId: string,
    driverId: string,
    offeredPrice: number,
    message?: string
  ) => Promise<void>;
  fetchRideOffers: (rideRequestId: string) => Promise<void>;
  setRideOffers: (offers: RideOffer[]) => void;

  // Ride Actions
  createRide: (
    rideRequestId: string,
    studentId: string,
    driverId: string,
    agreedPrice: number
  ) => Promise<void>;
  fetchRide: (rideId: string) => Promise<void>;
  setCurrentRide: (ride: Ride | null) => void;
  updateRideStatus: (rideId: string, status: string) => Promise<void>;
  fetchStudentRideHistory: (studentId: string) => Promise<void>;
  fetchDriverRideHistory: (driverId: string) => Promise<void>;

  // Payment Actions
  createPayment: (rideId: string, amount: number) => Promise<void>;
  updatePaymentStatus: (paymentId: string, status: string, ref?: string) => Promise<void>;

  // Utility
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  currentRide: null,
  currentRideRequest: null,
  rideRequests: [],
  rideOffers: [],
  rides: [],
  payments: [],
  isLoading: false,
  error: null,

  createRideRequest: async (
    studentId,
    pickupLocation,
    pickupLat,
    pickupLng,
    destinationLocation,
    destinationLat,
    destinationLng
  ) => {
    try {
      set({ isLoading: true, error: null });

      const { rideRequest, error } = await rideService.createRideRequest(
        studentId,
        pickupLocation,
        pickupLat,
        pickupLng,
        destinationLocation,
        destinationLat,
        destinationLng
      );

      if (error) throw error;

      set({
        currentRideRequest: rideRequest,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to create ride request',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPendingRideRequests: async () => {
    try {
      set({ isLoading: true });

      const { rideRequests, error } = await rideService.getPendingRideRequests();

      if (error) throw error;

      set({
        rideRequests: rideRequests || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch ride requests',
        isLoading: false,
      });
    }
  },

  setCurrentRideRequest: (rideRequest: RideRequest | null) => {
    set({ currentRideRequest: rideRequest });
  },

  updateRideRequestStatus: async (rideRequestId: string, status: string) => {
    try {
      set({ isLoading: true });

      const { error } = await rideService.updateRideRequestStatus(rideRequestId, status);

      if (error) throw error;

      const current = get().currentRideRequest;
      if (current?.id === rideRequestId) {
        set({ currentRideRequest: { ...current, status: status as any } });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to update ride request',
        isLoading: false,
      });
    }
  },

  createRideOffer: async (rideRequestId, driverId, offeredPrice, message) => {
    try {
      set({ isLoading: true, error: null });

      const { rideOffer, error } = await rideService.createRideOffer(
        rideRequestId,
        driverId,
        offeredPrice,
        message
      );

      if (error) throw error;

      const current = get().rideOffers;
      set({
        rideOffers: [...current, rideOffer],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to create ride offer',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchRideOffers: async (rideRequestId: string) => {
    try {
      set({ isLoading: true });

      const { rideOffers, error } = await rideService.getRideOffers(rideRequestId);

      if (error) throw error;

      set({
        rideOffers: rideOffers || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch ride offers',
        isLoading: false,
      });
    }
  },

  setRideOffers: (offers: RideOffer[]) => {
    set({ rideOffers: offers });
  },

  createRide: async (rideRequestId, studentId, driverId, agreedPrice) => {
    try {
      set({ isLoading: true, error: null });

      const { ride, error } = await rideService.createRide(
        rideRequestId,
        studentId,
        driverId,
        agreedPrice
      );

      if (error) throw error;

      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to create ride',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchRide: async (rideId: string) => {
    try {
      set({ isLoading: true });

      const { ride, error } = await rideService.getRide(rideId);

      if (error) throw error;

      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch ride',
        isLoading: false,
      });
    }
  },

  setCurrentRide: (ride: Ride | null) => {
    set({ currentRide: ride });
  },

  updateRideStatus: async (rideId: string, status: string) => {
    try {
      set({ isLoading: true });

      const { ride, error } = await rideService.updateRideStatus(rideId, status);

      if (error) throw error;

      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to update ride status',
        isLoading: false,
      });
    }
  },

  fetchStudentRideHistory: async (studentId: string) => {
    try {
      set({ isLoading: true });

      const { rides, error } = await rideService.getStudentRideHistory(studentId);

      if (error) throw error;

      set({
        rides: rides || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch ride history',
        isLoading: false,
      });
    }
  },

  fetchDriverRideHistory: async (driverId: string) => {
    try {
      set({ isLoading: true });

      const { rides, error } = await rideService.getDriverRideHistory(driverId);

      if (error) throw error;

      set({
        rides: rides || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch ride history',
        isLoading: false,
      });
    }
  },

  createPayment: async (rideId: string, amount: number) => {
    try {
      set({ isLoading: true, error: null });

      const { payment, error } = await rideService.createPayment(rideId, amount);

      if (error) throw error;

      set({
        payments: [...get().payments, payment],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to create payment',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePaymentStatus: async (paymentId: string, status: string, ref?: string) => {
    try {
      set({ isLoading: true });

      const { error } = await rideService.updatePaymentStatus(paymentId, status, ref);

      if (error) throw error;

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to update payment',
        isLoading: false,
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
