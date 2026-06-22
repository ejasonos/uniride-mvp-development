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
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuthStore } from '@store/authStore';
import { useChatStore } from '@store/chatStore';
import { useRideStore } from '@store/rideStore';
import { useTheme } from '@hooks/useTheme'
import { globalStyles } from '@styles/globalStyles';

export default function NegotiationChatScreen() {
  const router = useRouter();
  const { rideOfferId } = useLocalSearchParams();

  const { user } = useAuthStore();
  const { conversations, messages, sendMessage, subscribeToMessages } = useChatStore();
  const { rideOffers, createRide } = useRideStore();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  const offer = rideOffers.find((o) => o.id === rideOfferId);
  const convo = conversations.find((c) => c.ride_request_id === offer?.ride_request_id);

  const convoMessages =
    messages.filter((m) => m.conversation_id === convo?.id) || [];

  const { colors } = useTheme()
  const styles = createStyles(colors)

  useEffect(() => {
    if (convo?.id) subscribeToMessages(convo.id);
  }, [convo?.id]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [convoMessages]);

  const send = async () => {
    if (!text.trim() || !convo?.id || !user?.id) return;

    const msg = text.trim();
    setText('');

    await sendMessage(convo.id, user.id, msg);
  };

  const acceptOffer = async () => {
    if (!offer || !user?.id) return;

    setLoading(true);

    try {
      await createRide(
        offer.ride_request_id,
        user.id,
        offer.driver_id,
        offer.offered_price
      );

      router.replace('/student/ride-tracking');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: any) => {
    const mine = item.sender_id === user?.id;

    return (
      <View style={[globalStyles.container, styles.msgRow, mine && styles.msgRowRight]}>
        <View style={[styles.bubble, mine && styles.bubbleMine]}>
          <Text style={[styles.msgText, mine && styles.msgTextMine]}>
            {item.message}
          </Text>
          <Text style={[styles.time, mine && styles.timeMine]}>
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

      {/* TOP CONTEXT BAR (Uber-style) */}
      <View style={styles.offerBar}>
        <Text style={styles.offerLabel}>Driver Offer</Text>
        <Text style={styles.offerPrice}>
          ₦{offer?.offered_price?.toLocaleString()}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >

        {/* CHAT AREA */}
        <FlatList
          ref={listRef}
          data={convoMessages}
          keyExtractor={(i) => i.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chat}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Start negotiation</Text>
              <Text style={styles.emptySub}>
                Discuss price or ask the driver questions
              </Text>
            </View>
          }
        />

        {/* INPUT (Claude-style minimal floating bar) */}
        <View style={styles.inputBar}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message driver..."
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            onPress={send}
            disabled={!text.trim()}
            style={[styles.sendBtn, !text.trim() && styles.disabled]}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* DECISION CTA */}
        <View style={styles.ctaBar}>
          <TouchableOpacity
            onPress={acceptOffer}
            disabled={loading}
            style={styles.acceptBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.acceptText}>Accept Offer</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({

  flex: {
    flex: 1,
  },

  /* OFFER BAR (Uber negotiation header) */
  offerBar: {
    padding: 14,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerLabel: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
  },
  offerPrice: {
    color: colors.ACCENT,
    fontSize: 16,
    fontWeight: '700',
  },

  /* CHAT */
  chat: {
    padding: 14,
    paddingBottom: 80,
  },

  msgRow: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  msgRowRight: {
    alignItems: 'flex-end',
  },

  bubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    maxWidth: '80%',
  },
  bubbleMine: {
    backgroundColor: colors.PRIMARY,
  },

  msgText: {
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
  },
  msgTextMine: {
    color: '#fff',
  },

  time: {
    fontSize: 10,
    marginTop: 4,
    color: '#888',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.7)',
  },

  /* EMPTY STATE (Claude-like minimal tone) */
  empty: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 13,
    marginTop: 6,
    color: '#777',
    textAlign: 'center',
  },

  /* INPUT (Claude floating composer style) */
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
  },
  sendBtn: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },

  /* CTA (Uber decision layer) */
  ctaBar: {
    padding: 12,
    backgroundColor: '#fff',
  },
  acceptBtn: {
    backgroundColor: colors.ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptText: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.TEXT_PRIMARY,
  },
});