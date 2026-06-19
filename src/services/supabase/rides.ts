import { supabase } from './client';
import { RideRequest, RideOffer, Ride, Payment } from '@app-types/index';

// Ride Request Methods
export const createRideRequest = async (
  studentId: string,
  pickupLocation: string,
  pickupLat: number,
  pickupLng: number,
  destinationLocation: string,
  destinationLat: number,
  destinationLng: number
) => {
  try {
    const { data, error } = await supabase
      .from('ride_requests')
      .insert({
        student_id: studentId,
        pickup_location: pickupLocation,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        destination_location: destinationLocation,
        destination_lat: destinationLat,
        destination_lng: destinationLng,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { rideRequest: data, error: null };
  } catch (error) {
    return { rideRequest: null, error };
  }
};

export const getRideRequest = async (rideRequestId: string) => {
  try {
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*')
      .eq('id', rideRequestId)
      .single();

    if (error) throw error;
    return { rideRequest: data, error: null };
  } catch (error) {
    return { rideRequest: null, error };
  }
};

export const getPendingRideRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { rideRequests: data, error: null };
  } catch (error) {
    return { rideRequests: null, error };
  }
};

export const updateRideRequestStatus = async (
  rideRequestId: string,
  status: string
) => {
  try {
    const { data, error } = await supabase
      .from('ride_requests')
      .update({ status })
      .eq('id', rideRequestId)
      .select()
      .single();

    if (error) throw error;
    return { rideRequest: data, error: null };
  } catch (error) {
    return { rideRequest: null, error };
  }
};

// Ride Offer Methods
export const createRideOffer = async (
  rideRequestId: string,
  driverId: string,
  offeredPrice: number,
  message?: string
) => {
  try {
    const { data, error } = await supabase
      .from('ride_offers')
      .insert({
        ride_request_id: rideRequestId,
        driver_id: driverId,
        offered_price: offeredPrice,
        message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { rideOffer: data, error: null };
  } catch (error) {
    return { rideOffer: null, error };
  }
};

export const getRideOffers = async (rideRequestId: string) => {
  try {
    const { data, error } = await supabase
      .from('ride_offers')
      .select(`
        *,
        drivers:driver_id (*)
      `)
      .eq('ride_request_id', rideRequestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { rideOffers: data, error: null };
  } catch (error) {
    return { rideOffers: null, error };
  }
};

// Ride Methods
export const createRide = async (
  rideRequestId: string,
  studentId: string,
  driverId: string,
  agreedPrice: number
) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .insert({
        ride_request_id: rideRequestId,
        student_id: studentId,
        driver_id: driverId,
        agreed_price: agreedPrice,
        status: 'agreed',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { ride: data, error: null };
  } catch (error) {
    return { ride: null, error };
  }
};

export const getRide = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single();

    if (error) throw error;
    return { ride: data, error: null };
  } catch (error) {
    return { ride: null, error };
  }
};

export const updateRideStatus = async (rideId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({ status })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;
    return { ride: data, error: null };
  } catch (error) {
    return { ride: null, error };
  }
};

export const getStudentRideHistory = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:driver_id (*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { rides: data, error: null };
  } catch (error) {
    return { rides: null, error };
  }
};

export const getDriverRideHistory = async (driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        student:student_id (*)
      `)
      .eq('driver_id', driverId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { rides: data, error: null };
  } catch (error) {
    return { rides: null, error };
  }
};

// Payment Methods
export const createPayment = async (rideId: string, amount: number) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ride_id: rideId,
        amount,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { payment: data, error: null };
  } catch (error) {
    return { payment: null, error };
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  paymentReference?: string
) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        payment_reference: paymentReference,
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return { payment: data, error: null };
  } catch (error) {
    return { payment: null, error };
  }
};

export const getPayment = async (paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    return { payment: data, error: null };
  } catch (error) {
    return { payment: null, error };
  }
};
