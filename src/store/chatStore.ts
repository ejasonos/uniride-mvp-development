import { create } from 'zustand';
import { Message, Conversation } from '@types/index';
import * as chatService from '@services/supabase/chat';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  subscriptions: Array<() => void>;

  // Conversation Actions
  createConversation: (
    rideRequestId: string,
    studentId: string,
    driverId: string
  ) => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<void>;
  fetchConversationByRideRequest: (rideRequestId: string) => Promise<void>;
  fetchStudentConversations: (studentId: string) => Promise<void>;
  fetchDriverConversations: (driverId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;

  // Message Actions
  sendMessage: (
    conversationId: string,
    senderId: string,
    message: string
  ) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  subscribeToMessages: (conversationId: string) => void;
  unsubscribeFromMessages: () => void;
  addMessage: (message: Message) => void;

  // Utility
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  cleanup: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  subscriptions: [],

  createConversation: async (rideRequestId, studentId, driverId) => {
    try {
      set({ isLoading: true, error: null });

      const { conversation, error } = await chatService.createConversation(
        rideRequestId,
        studentId,
        driverId
      );

      if (error) throw error;

      set({
        currentConversation: conversation,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to create conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchConversation: async (conversationId: string) => {
    try {
      set({ isLoading: true });

      const { conversation, error } = await chatService.getConversation(conversationId);

      if (error) throw error;

      set({
        currentConversation: conversation,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch conversation',
        isLoading: false,
      });
    }
  },

  fetchConversationByRideRequest: async (rideRequestId: string) => {
    try {
      set({ isLoading: true });

      const { conversation, error } = await chatService.getConversationByRideRequest(
        rideRequestId
      );

      if (error) throw error;

      set({
        currentConversation: conversation,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch conversation',
        isLoading: false,
      });
    }
  },

  fetchStudentConversations: async (studentId: string) => {
    try {
      set({ isLoading: true });

      const { conversations, error } = await chatService.getStudentConversations(
        studentId
      );

      if (error) throw error;

      set({
        conversations: conversations || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch conversations',
        isLoading: false,
      });
    }
  },

  fetchDriverConversations: async (driverId: string) => {
    try {
      set({ isLoading: true });

      const { conversations, error } = await chatService.getDriverConversations(
        driverId
      );

      if (error) throw error;

      set({
        conversations: conversations || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch conversations',
        isLoading: false,
      });
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation });
  },

  sendMessage: async (conversationId, senderId, message) => {
    try {
      set({ isLoading: true, error: null });

      const { message: newMessage, error } = await chatService.sendMessage(
        conversationId,
        senderId,
        message
      );

      if (error) throw error;

      set({
        messages: [...get().messages, newMessage],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to send message',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      set({ isLoading: true });

      const { messages, error } = await chatService.getMessages(conversationId);

      if (error) throw error;

      set({
        messages: messages || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to fetch messages',
        isLoading: false,
      });
    }
  },

  subscribeToMessages: (conversationId: string) => {
    const unsubscribe = chatService.subscribeToMessages(conversationId, (message) => {
      set({
        messages: [...get().messages, message],
      });
    });

    set({
      subscriptions: [...get().subscriptions, unsubscribe],
    });
  },

  unsubscribeFromMessages: () => {
    const { subscriptions } = get();
    subscriptions.forEach((unsub) => unsub());
    set({ subscriptions: [] });
  },

  addMessage: (message: Message) => {
    set({
      messages: [...get().messages, message],
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
      conversations: [],
      currentConversation: null,
      messages: [],
      subscriptions: [],
    });
  },
}));
