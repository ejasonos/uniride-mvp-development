import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@constants/index';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Methods
export const signUp = async (
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
) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        role,
        full_name: fullName,
        phone,
        university_email: email,
        created_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    // Create driver record if driver
    if (role === 'driver' && additionalData) {
      const { error: driverError } = await supabase
        .from('drivers')
        .insert({
          id: authData.user.id,
          vehicle_type: additionalData.vehicle_type,
          vehicle_registration: additionalData.vehicle_registration,
          is_online: false,
          updated_at: new Date().toISOString(),
        });

      if (driverError) throw driverError;
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    return { session: null, error };
  }
};

// Profile Methods
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
};

export const updateProfile = async (userId: string, updates: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
};

// Driver Methods
export const getDriver = async (driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', driverId)
      .single();

    if (error) throw error;
    return { driver: data, error: null };
  } catch (error) {
    return { driver: null, error };
  }
};

export const getOnlineDrivers = async () => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_online', true);

    if (error) throw error;
    return { drivers: data, error: null };
  } catch (error) {
    return { drivers: null, error };
  }
};

export const updateDriverLocation = async (
  driverId: string,
  latitude: number,
  longitude: number
) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        current_lat: latitude,
        current_lng: longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return { driver: data, error: null };
  } catch (error) {
    return { driver: null, error };
  }
};

export const toggleDriverOnlineStatus = async (driverId: string, isOnline: boolean) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ is_online: isOnline })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return { driver: data, error: null };
  } catch (error) {
    return { driver: null, error };
  }
};
