import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@store/authStore';
import { useChatStore } from '@store/chatStore';
import { useRideStore } from '@store/rideStore';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

export default function NegotiationChatScreen() {
  const router = useRouter();
  const { rideOfferId } = useLocalSearchParams<{ rideOfferId?: string | string[] }>();
  const resolvedRideOfferId = Array.isArray(rideOfferId) ? rideOfferId[0] : rideOfferId;
  const { user } = useAuthStore();
  const { conversations, messages, sendMessage, subscribeToMessages } = useChatStore();
  const { rideOffers, createRide } = useRideStore();
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const currentOffer = rideOffers.find((o) => o.id === resolvedRideOfferId);
  const conversation = conversations.find((c) => c.ride_request_id === currentOffer?.ride_request_id);
  const conversationMessages = messages.filter((m) => m.conversation_id === conversation?.id) || [];

  useEffect(() => {
    if (conversation?.id) {
      subscribeToMessages(conversation.id);
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (conversationMessages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversation?.id || !user?.id) return;

    try {
      const message = messageText.trim();
      setMessageText('');

      await sendMessage(conversation.id, user.id, message);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleAcceptOffer = async () => {
    try {
      if (!currentOffer || !user?.id) return;

      setIsLoading(true);

      await createRide(
        currentOffer.ride_request_id,
        user.id,
        currentOffer.driver_id,
        currentOffer.offered_price
      );

      Alert.alert('Success', 'Offer accepted! Proceeding to tracking.');
      router.push('/student/ride-tracking');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept offer');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isOwnMessage = item.sender_id === user?.id;

    return (
      <View style={[styles.messageRow, isOwnMessage && styles.ownMessageRow]}>
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          <Text style={[globalStyles.bodyMedium, isOwnMessage && styles.ownMessageText]}>
            {item.message}
          </Text>
          <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Negotiate with Driver</Text>
        <Text style={styles.price}>₦{currentOffer?.offered_price.toLocaleString()}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <FlatList
          ref={flatListRef}
          data={conversationMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={globalStyles.bodyMedium}>Start the conversation</Text>
              <Text style={globalStyles.bodySmall}>You can negotiate the price or ask questions</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.GRAY}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.acceptButton, isLoading && styles.acceptButtonDisabled]}
            onPress={handleAcceptOffer}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.SECONDARY} />
            ) : (
              <Text style={styles.acceptButtonText}>Accept This Offer</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  content: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageRow: {
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  ownMessageRow: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '85%',
  },
  ownMessageBubble: {
    backgroundColor: COLORS.PRIMARY,
  },
  ownMessageText: {
    color: COLORS.SECONDARY,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  ownTimestamp: {
    color: COLORS.SECONDARY,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: COLORS.TEXT_PRIMARY,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.SECONDARY,
    fontWeight: '600',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  acceptButton: {
    paddingVertical: 14,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
});
