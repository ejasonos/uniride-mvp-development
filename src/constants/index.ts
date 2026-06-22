export const LIGHT_THEME = {
  PRIMARY: '#0057D9',
  SECONDARY: '#FFFFFF',
  ACCENT: '#FFC107',

  BACKGROUND: '#F6F7F9',
  CARD: '#FFFFFF',

  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',

  BORDER: '#E0E0E0',

  ERROR: '#D32F2F',
  SUCCESS: '#388E3C',

  GRAY: '#E0E0E0',
  DARK_GRAY: '#666666',
  
  DARK: '#000000',
  LIGHT_GRAY: '#F5F5F5',
};

export const DARK_THEME = {
  PRIMARY: '#4C8DFF',
  SECONDARY: '#0B0F14',
  ACCENT: '#FFD54F',

  BACKGROUND: '#0B0F14',
  CARD: '#121821',

  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A0A0A0',

  BORDER: '#1F2A36',

  ERROR: '#FF5A5A',
  SUCCESS: '#4CAF50',
  
  GRAY: '#E0E0E0',
  DARK_GRAY: '#666666',

  DARK: '#000000',
  LIGHT_GRAY: '#F5F5F5',
};

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

// Status colors
export const STATUS_COLORS = {
  pending: '#FFC107',
  negotiating: '#2196F3',
  agreed: '#4CAF50',
  in_progress: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
} as const;

// Location Settings
export const LOCATION_ACCURACY = 6; // High accuracy
export const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
