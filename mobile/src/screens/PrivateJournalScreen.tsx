/**
 * Private Journal Screen (Tier 1)
 *
 * Follows ui-ux-expert mandate #1: Visual Demarcation
 * - Warm sand background signals "YOUR private space"
 * - Shows the user's OWN raw Tier 1 messages + AI insights
 * - This content is NEVER shared with the partner
 *
 * Follows native-mobile-developer mandate #1: At-Rest Encryption
 * - All journal entries stored via expo-secure-store (Keychain/Keystore)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { getJournalEntries } from '../services/secure-storage';
import type { JournalEntry } from '../types';

interface PrivateJournalScreenProps {
  onBack: () => void;
}

const ATTACHMENT_LABELS: Record<string, string> = {
  anxious: 'Anxious — seeking reassurance',
  avoidant: 'Avoidant — pulling away',
  secure: 'Secure — balanced',
  disorganized: 'Disorganized — mixed signals',
};

export function PrivateJournalScreen({ onBack }: PrivateJournalScreenProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    getJournalEntries().then(setEntries);
  }, []);

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.entryCard}>
      {/* What you said (Tier 1 — private) */}
      <View style={styles.tier1Section}>
        <Text style={styles.sectionLabel}>What you said (private)</Text>
        <Text style={styles.tier1Text}>{item.rawMessage}</Text>
      </View>

      {/* What your partner received (Tier 3) */}
      {item.tier3Translation && (
        <View style={styles.tier3Section}>
          <Text style={styles.sectionLabel}>What your partner received</Text>
          <Text style={styles.tier3Text}>{item.tier3Translation}</Text>
        </View>
      )}

      {/* AI Insight */}
      {item.attachmentStyle && (
        <View style={styles.insightSection}>
          <Text style={styles.insightLabel}>Attachment pattern detected</Text>
          <Text style={styles.insightText}>
            {ATTACHMENT_LABELS[item.attachmentStyle] ?? item.attachmentStyle}
          </Text>
          {item.activationState && item.activationState !== 'baseline' && (
            <Text style={styles.activationBadge}>
              Emotional state: {item.activationState}
            </Text>
          )}
        </View>
      )}

      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()} at{' '}
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back to Chat</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Private Journal</Text>
        <Text style={styles.headerSubtitle}>
          Only you can see this — never shared with your partner
        </Text>
      </View>

      {/* Privacy badge */}
      <View style={styles.privacyBadge}>
        <Text style={styles.privacyText}>🔒 Encrypted with device security</Text>
      </View>

      {/* Journal entries */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your private reflections</Text>
            <Text style={styles.emptySubtitle}>
              After you send messages in the Shared Room,{'\n'}
              your original words and AI insights appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tier1Private, // Visual demarcation: warm sand = private
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.tier1Private,
    borderBottomWidth: 1,
    borderBottomColor: colors.tier1PrivateBorder,
  },
  backButton: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.sm,
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
  privacyBadge: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  privacyText: {
    ...typography.caption,
    color: colors.white,
  },
  list: {
    padding: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.tier1PrivateBorder,
    ...shadows.sm,
  },
  tier1Section: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  tier1Text: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
  },
  tier3Section: {
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tier3Text: {
    ...typography.body,
    color: colors.primary,
  },
  insightSection: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  insightLabel: {
    ...typography.caption,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  insightText: {
    ...typography.bodySmall,
    color: colors.secondaryDark,
  },
  activationBadge: {
    ...typography.caption,
    color: colors.safetyWarning,
    marginTop: spacing.xs,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
