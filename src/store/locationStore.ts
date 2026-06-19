import { create } from 'zustand';
import { Location } from '@app-types/index';
import * as supabase from '@services/supabase/client';

interface LocationState {
  currentLocation: Location | null;
  driverLocation: Location | null;
  driverLocations: Map<string, Location>;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  subscriptions: Array<() => void>;

  // Location Actions
  updateCurrentLocation: (location: Location) => void;
  setCurrentLocation: (location: Location | null) => void;
  updateDriverLocation: (location: Location) => void;
  setDriverLocation: (location: Location | null) => void;
  updateDriverLocationMap: (driverId: string, location: Location) => void;
  getDriverLocation: (driverId: string) => Location | undefined;

  // Tracking Actions
  startLocationTracking: (driverId: string) => Promise<void>;
  stopLocationTracking: () => void;
  subscribeToDriverLocation: (driverId: string, callback: (location: Location) => void) => void;

  // Utility
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  cleanup: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  driverLocation: null,
  driverLocations: new Map(),
  isTracking: false,
  isLoading: false,
  error: null,
  subscriptions: [],

  updateCurrentLocation: (location: Location) => {
    set({ currentLocation: location });
  },

  setCurrentLocation: (location: Location | null) => {
    set({ currentLocation: location });
  },

  updateDriverLocation: (location: Location) => {
    set({ driverLocation: location });
  },

  setDriverLocation: (location: Location | null) => {
    set({ driverLocation: location });
  },

  updateDriverLocationMap: (driverId: string, location: Location) => {
    const { driverLocations } = get();
    const newMap = new Map(driverLocations);
    newMap.set(driverId, location);
    set({ driverLocations: newMap });
  },

  getDriverLocation: (driverId: string) => {
    const { driverLocations } = get();
    return driverLocations.get(driverId);
  },

  startLocationTracking: async (driverId: string) => {
    try {
      set({ isLoading: true, isTracking: true });

      // Subscribe to driver location updates via Realtime
      const channel = supabase.supabase
        .channel(`driver_location:${driverId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'drivers',
            filter: `id=eq.${driverId}`,
          },
          (payload) => {
            const { current_lat, current_lng } = payload.new;
            if (current_lat && current_lng) {
              const location: Location = {
                latitude: current_lat,
                longitude: current_lng,
              };
              set({ driverLocation: location });
              get().updateDriverLocationMap(driverId, location);
            }
          }
        )
        .subscribe();

      // Get initial driver location
      const { driver } = await supabase.getDriver(driverId);
      if (driver?.current_lat && driver?.current_lng) {
        const initialLocation: Location = {
          latitude: driver.current_lat,
          longitude: driver.current_lng,
        };
        set({ driverLocation: initialLocation });
        get().updateDriverLocationMap(driverId, initialLocation);
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to start location tracking',
        isLoading: false,
      });
    }
  },

  stopLocationTracking: () => {
    const { subscriptions } = get();
    subscriptions.forEach((unsub) => unsub());
    set({
      isTracking: false,
      subscriptions: [],
      driverLocation: null,
    });
  },

  subscribeToDriverLocation: (driverId: string, callback: (location: Location) => void) => {
    const unsubscribe = supabase.supabase
      .channel(`driver_location:${driverId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${driverId}`,
        },
        (payload) => {
          const { current_lat, current_lng } = payload.new;
          if (current_lat && current_lng) {
            callback({
              latitude: current_lat,
              longitude: current_lng,
            });
          }
        }
      )
      .subscribe();

    set({
      subscriptions: [...get().subscriptions, () => supabase.supabase.removeChannel(unsubscribe)],
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  cleanup: () => {
    const { subscriptions } = get();
    subscriptions.forEach((unsub) => unsub());
    set({
      currentLocation: null,
      driverLocation: null,
      driverLocations: new Map(),
      isTracking: false,
      subscriptions: [],
    });
  },
}));
