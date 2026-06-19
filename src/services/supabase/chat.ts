import { supabase } from './client';
import { Message, Conversation } from '@types/index';

// Conversation Methods
export const createConversation = async (
  rideRequestId: string,
  studentId: string,
  driverId: string
) => {
  try {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('ride_request_id', rideRequestId)
      .eq('student_id', studentId)
      .eq('driver_id', driverId)
      .single();

    if (existing) {
      return { conversation: existing, error: null };
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        ride_request_id: rideRequestId,
        student_id: studentId,
        driver_id: driverId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { conversation: data, error: null };
  } catch (error) {
    return { conversation: null, error };
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    return { conversation: data, error: null };
  } catch (error) {
    return { conversation: null, error };
  }
};

export const getConversationByRideRequest = async (rideRequestId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('ride_request_id', rideRequestId)
      .single();

    if (error) throw error;
    return { conversation: data, error: null };
  } catch (error) {
    return { conversation: null, error };
  }
};

export const getStudentConversations = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        driver:driver_id (full_name, phone),
        ride_request:ride_request_id (status)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { conversations: data, error: null };
  } catch (error) {
    return { conversations: null, error };
  }
};

export const getDriverConversations = async (driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        student:student_id (full_name, phone),
        ride_request:ride_request_id (status)
      `)
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { conversations: data, error: null };
  } catch (error) {
    return { conversations: null, error };
  }
};

// Message Methods
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  message: string
) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { message: data, error: null };
  } catch (error) {
    return { message: null, error };
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (full_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { messages: data, error: null };
  } catch (error) {
    return { messages: null, error };
  }
};

export const subscribeToMessages = (
  conversationId: string,
  callback: (message: Message) => void
) => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToConversations = (
  userId: string,
  callback: (data: any) => void
) => {
  const channel = supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
