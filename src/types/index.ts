// User Types
export interface Profile {
  id: string;
  role: 'student' | 'driver';
  full_name: string;
  phone: string;
  university_email: string;
  created_at: string;
}

export interface Driver extends Profile {
  vehicle_type: string;
  vehicle_registration: string;
  is_online: boolean;
  current_lat?: number;
  current_lng?: number;
  updated_at: string;
}

// Ride Types
export interface RideRequest {
  id: string;
  student_id: string;
  pickup_location: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_location: string;
  destination_lat: number;
  destination_lng: number;
  status: 'pending' | 'negotiating' | 'agreed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface RideOffer {
  id: string;
  ride_request_id: string;
  driver_id: string;
  offered_price: number;
  message?: string;
  created_at: string;
}

// Chat Types
export interface Conversation {
  id: string;
  ride_request_id: string;
  student_id: string;
  driver_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

// Payment Types
export interface Ride {
  id: string;
  ride_request_id: string;
  student_id: string;
  driver_id: string;
  agreed_price: number;
  status: 'agreed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Payment {
  id: string;
  ride_id: string;
  amount: number;
  payment_reference?: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
}
