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
import { createGlobalStyles } from '@styles/globalStyles';

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
  const globalStyles = createGlobalStyles(colors)

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

      {/* TOP CONTEXT BAR */}
      <View style={[styles.offerCard]}>
        <View style={styles.offerTopRow}>
          <View>
            <Text style={styles.offerLabel}>
              Driver Offer
            </Text>

            <Text style={styles.offerPrice}>
              ₦{offer?.offered_price?.toLocaleString()}
            </Text>
          </View>

          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>
              Best Match
            </Text>
          </View>
        </View>

        <View style={styles.offerMetaRow}>
          <Text style={styles.offerMeta}>
            🚗 Campus Driver
          </Text>

          <Text style={styles.offerMeta}>
            • 3 mins away
          </Text>
        </View>

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
        <View style={styles.composerWrapper}>

          <View style={styles.composer}>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Negotiate price or ask a question..."
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              onPress={send}
              disabled={!text.trim()}
              style={[
                styles.sendButton,
                !text.trim() && styles.sendButtonDisabled,
              ]}
            >
              <Text style={[styles.sendIcon, {fontSize: 10}]}>
                Send
              </Text>
            </TouchableOpacity>

          </View>

        </View>

        {/* DECISION CTA */}
        <View style={styles.bottomActionCard}>

          <Text style={styles.bottomTitle}>
            Ready to ride?
          </Text>

          <Text style={styles.bottomSubtitle}>
            Accept this offer and begin your trip.
          </Text>

          <TouchableOpacity
            onPress={acceptOffer}
            disabled={loading}
            style={styles.acceptBtn}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.acceptText}>
                Accept Ride Offer
              </Text>
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
    marginTop: 20
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
  offerCard: {
    marginHorizontal: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 24,

    backgroundColor: colors.CARD || '#FFFFFF',

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  offerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  offerLabel: {
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
  },

  offerPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
    color: colors.TEXT_PRIMARY,
  },

  offerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,

    backgroundColor: 'rgba(34,197,94,0.15)',
  },

  offerBadgeText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 12,
  },

  offerMetaRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  offerMeta: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
  },

  composerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    borderRadius: 28,

    backgroundColor: colors.CARD || '#FFF',

    padding: 8,

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  input: {
    flex: 1,

    minHeight: 48,
    maxHeight: 120,

    fontSize: 15,

    paddingHorizontal: 16,
    paddingVertical: 12,

    color: colors.TEXT_PRIMARY,
  },

  sendButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.PRIMARY,
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  sendIcon: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 18,
  },

  bottomActionCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    backgroundColor: colors.BACKGROUND,
  },

  bottomTitle: {
    fontSize: 18,
    fontWeight: '700',

    color: colors.TEXT_PRIMARY,
  },

  bottomSubtitle: {
    marginTop: 4,
    marginBottom: 16,

    color: colors.TEXT_SECONDARY,
  },

  acceptBtn: {
    height: 58,

    borderRadius: 999,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#111111',
  },

  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});