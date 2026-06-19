// Colors
export const COLORS = {
  PRIMARY: '#0057D9',
  SECONDARY: '#FFFFFF',
  ACCENT: '#FFC107',
  DARK: '#000000',
  LIGHT_GRAY: '#F5F5F5',
  GRAY: '#E0E0E0',
  DARK_GRAY: '#666666',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  ERROR: '#D32F2F',
  SUCCESS: '#388E3C',
  WARNING: '#F57C00',
} as const;

// Supabase
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Flutterwave
export const FLUTTERWAVE_PUBLIC_KEY = process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '';
export const FLUTTERWAVE_MERCHANT_KEY = process.env.EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY || '';

// API Endpoints
export const API_BASE_URL = SUPABASE_URL;

// Vehicle Types
export const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Minibus',
  'Van',
  'Truck',
] as const;

// Status Colors
export const STATUS_COLORS = {
  pending: '#FFC107',
  negotiating: '#2196F3',
  agreed: '#4CAF50',
  in_progress: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
} as const;

// Map Settings
export const DEFAULT_MAP_REGION = {
  latitude: 0.3476,
  longitude: 32.5825,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Location Settings
export const LOCATION_ACCURACY = 6; // High accuracy
export const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
