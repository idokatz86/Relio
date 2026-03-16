/**
 * Shared Chat Room Screen (Tier 3)
 *
 * Follows ui-ux-expert mandate #1: Visual Demarcation
 * - Soft mint-white background signals "shared space"
 * - Partner sees ONLY Tier 3 AI-transformed messages
 * - Original Tier 1 text is NEVER displayed here
 *
 * Follows backend-developer mandate #2: Intercept & Hold
 * - "Mediating..." indicator while pipeline processes
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { sendMessage } from '../services/api';
import { saveJournalEntry } from '../services/secure-storage';
import type { ChatMessage, JournalEntry } from '../types';

interface SharedChatScreenProps {
  userId: string;
  onSafetyHalt: (severity: string, reasoning: string) => void;
  onOpenJournal: () => void;
}

export function SharedChatScreen({ userId, onSafetyHalt, onOpenJournal }: SharedChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;

    setInputText('');
    setIsProcessing(true);

    // Show "mediating" state (intercept & hold)
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        content: text,
        fromUserId: userId,
        isMine: true,
        tier: 1,
        timestamp: new Date(),
        isProcessing: true,
      },
    ]);

    try {
      const result = await sendMessage(userId, text);

      // Safety halt — trigger crisis screen
      if (result.safetyHalt) {
        onSafetyHalt(result.safetySeverity, 'Safety concern detected');
        setIsProcessing(false);
        // Remove temp message
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      // Save to private journal (encrypted, Tier 1 — native-mobile-developer mandate)
      const journalEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        rawMessage: text,
        tier3Translation: result.tier3Output,
        attachmentStyle: result.profile?.attachmentStyle,
        activationState: result.profile?.activationState,
        timestamp: new Date(),
        safetyLevel: result.safetySeverity,
      };
      saveJournalEntry(journalEntry);

      // Replace temp message with Tier 3 version in shared room
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: `msg-${Date.now()}`,
                content: result.tier3Output ?? '',
                tier: 3 as const,
                isProcessing: false,
                safetyLevel: result.safetySeverity,
              }
            : m,
        ),
      );
    } catch (err) {
      console.error('[Chat] Pipeline error:', err);
      // Show error in the bubble instead of removing it
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, content: 'Failed to connect. Check backend.', isProcessing: false }
            : m,
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, isProcessing, userId, onSafetyHalt]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    if (item.isProcessing) {
      return (
        <View style={[styles.messageBubble, styles.myMessage, styles.processingBubble]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.processingText}>Mediating...</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          item.isMine ? styles.myMessage : styles.partnerMessage,
        ]}
      >
        <Text style={[styles.messageText, !item.isMine && styles.partnerMessageText]}>
          {item.content}
        </Text>
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shared Room</Text>
        <Text style={styles.headerSubtitle}>Tier 3 — Safe for both partners</Text>
        <TouchableOpacity style={styles.journalButton} onPress={onOpenJournal}>
          <Text style={styles.journalButtonText}>My Journal</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your safe space to communicate</Text>
            <Text style={styles.emptySubtitle}>
              Messages you send here are transformed by Relio{'\n'}
              into constructive, empathetic questions.
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Express what you're feeling..."
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={2000}
          editable={!isProcessing}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isProcessing) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isProcessing}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tier3Shared, // Visual demarcation: mint-white = shared
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.tier3SharedBorder,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  journalButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.tier1Private,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.tier1PrivateBorder,
  },
  journalButtonText: {
    ...typography.label,
    color: colors.primaryDark,
  },
  messageList: {
    padding: spacing.md,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  processingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
  },
  processingText: {
    ...typography.bodySmall,
    color: colors.white,
    fontStyle: 'italic',
  },
  messageText: {
    ...typography.body,
    color: colors.white,
  },
  partnerMessageText: {
    color: colors.text,
  },
  messageTime: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.7,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.tier3Shared,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  sendButtonText: {
    ...typography.label,
    color: colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
