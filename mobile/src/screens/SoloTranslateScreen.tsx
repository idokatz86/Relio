/**
 * SoloTranslateScreen — The Emotional Translator
 *
 * Sprint 15 / Issue #197 — Core solo venting mode.
 * User types raw frustration (Tier 1), gets constructive
 * Tier 3 output they can copy/share and send to their partner.
 *
 * Survey evidence:
 * - 61.4% want "private venting stays private"
 * - 55.4% want "AI translates frustration into something constructive"
 * - 47.5% "don't know how to phrase it without sounding hurtful"
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Share,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  translateSolo,
  getUsageStatus,
  type SoloTranslation,
  type UsageStatus,
} from '../services/api';

export function SoloTranslateScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SoloTranslation | null>(null);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [copied, setCopied] = useState(false);

  // Load usage on mount
  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = useCallback(async () => {
    try {
      const status = await getUsageStatus();
      setUsage(status);
    } catch (err) {
      console.error('[Solo] Usage load failed:', err);
    }
  }, []);

  const handleTranslate = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await translateSolo(input.trim());
      setResult(response);

      // Refresh usage count
      await loadUsage();
    } catch (err) {
      console.error('[Solo] Translation failed:', err);
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.tier3Output) return;
    try {
      // Use Share API as clipboard fallback — works cross-platform in Expo
      await Share.share({ message: result.tier3Output });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (!result?.tier3Output) return;
    try {
      await Share.share({ message: result.tier3Output });
    } catch {}
  };

  const handleNewTranslation = () => {
    setInput('');
    setResult(null);
    setCopied(false);
  };

  const isAtLimit = usage?.tier === 'free' && usage?.remaining === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Say it here first</Text>
          <Text style={styles.subtitle}>
            Type what you really feel. We'll help you say it so they hear it.
          </Text>
        </View>

        {/* Usage badge */}
        {usage && usage.tier === 'free' && (
          <View style={styles.usageBadge}>
            <Text style={styles.usageText}>
              {usage.remaining} of {usage.limit} free this week
            </Text>
          </View>
        )}

        {/* Input area */}
        {!result && (
          <View style={styles.inputSection}>
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <Text style={styles.privacyText}>Private — only you see this</Text>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="What do you want to say to your partner?"
              placeholderTextColor={colors.textLight}
              multiline
              maxLength={2000}
              value={input}
              onChangeText={setInput}
              textAlignVertical="top"
              accessibilityLabel="Type what you want to say to your partner"
              accessibilityHint="Your raw thoughts stay private. Only the translated version can be shared."
              editable={!isAtLimit}
            />

            <Text style={styles.charCount}>
              {input.length}/2000
            </Text>

            {isAtLimit ? (
              <View style={styles.limitReached}>
                <Text style={styles.limitText}>
                  You've used all 5 free translations this week.
                </Text>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  accessibilityLabel="Upgrade to Plus for unlimited translations"
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade to Plus — $4.99/mo
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.translateButton,
                  (!input.trim() || loading) && styles.translateButtonDisabled,
                ]}
                onPress={handleTranslate}
                disabled={!input.trim() || loading}
                accessibilityLabel="Help me say this better"
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.translateButtonText}>
                    Help me say this better
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Result area */}
        {result && result.tier3Output && (
          <View style={styles.resultSection}>
            {/* What you typed (collapsed) */}
            <View style={styles.originalCard}>
              <Text style={styles.originalLabel}>🔒 What you typed (private)</Text>
              <Text style={styles.originalText} numberOfLines={2}>
                {input}
              </Text>
            </View>

            {/* Tier 3 output */}
            <View style={styles.translationCard}>
              <Text style={styles.translationLabel}>✨ Try saying this instead</Text>
              <Text style={styles.translationText}>
                {result.tier3Output}
              </Text>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.copyButton]}
                  onPress={handleCopy}
                  accessibilityLabel="Copy translated message to clipboard"
                  accessibilityRole="button"
                >
                  <Text style={styles.actionButtonText}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={handleShare}
                  accessibilityLabel="Share translated message"
                  accessibilityRole="button"
                >
                  <Text style={styles.actionButtonText}>📤 Share</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Try again */}
            <TouchableOpacity
              style={styles.newTranslationButton}
              onPress={handleNewTranslation}
              accessibilityLabel="Translate something else"
              accessibilityRole="button"
            >
              <Text style={styles.newTranslationText}>
                Translate something else
              </Text>
            </TouchableOpacity>

            {/* Usage after translation */}
            {usage && usage.tier === 'free' && (
              <Text style={styles.usageAfter}>
                {usage.remaining} translations remaining this week
              </Text>
            )}

            {/* Partner invite prompt (after 3rd+ translation) */}
            {usage && (usage.used ?? 0) >= 3 && (
              <View style={styles.invitePrompt}>
                <Text style={styles.invitePromptText}>
                  💡 Want your partner to also get help finding the right words?
                </Text>
                <Text style={styles.invitePromptSub}>
                  Their space is completely private — you'll never see what they write.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Safety halt */}
        {result && result.safetyHalt && (
          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>We noticed something important</Text>
            <Text style={styles.safetyText}>
              It sounds like things might be really tough right now. Your safety
              matters most. Please reach out to someone who can help.
            </Text>
            <TouchableOpacity
              style={styles.crisisButton}
              accessibilityLabel="View crisis resources"
              accessibilityRole="button"
            >
              <Text style={styles.crisisButtonText}>
                View crisis resources
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  // Usage badge
  usageBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  usageText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  // Input section
  inputSection: {
    marginBottom: spacing.lg,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  privacyIcon: {
    fontSize: 14,
  },
  privacyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: colors.tier1Private,
    borderWidth: 1,
    borderColor: colors.tier1PrivateBorder,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 120,
    maxHeight: 200,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  translateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius?.lg ?? 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  translateButtonDisabled: {
    opacity: 0.5,
  },
  translateButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  // Limit reached
  limitReached: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  limitText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  upgradeButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius?.lg ?? 12,
  },
  upgradeButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  // Result section
  resultSection: {
    gap: spacing.md,
  },
  originalCard: {
    backgroundColor: colors.tier1Private,
    borderWidth: 1,
    borderColor: colors.tier1PrivateBorder,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.md,
  },
  originalLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  originalText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  translationCard: {
    backgroundColor: colors.tier3Shared,
    borderWidth: 1.5,
    borderColor: colors.tier3SharedBorder,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.lg,
  },
  translationLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  translationText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius?.md ?? 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '700',
  },
  newTranslationButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  newTranslationText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  usageAfter: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
  },
  invitePrompt: {
    backgroundColor: colors.primaryLight + '15',
    borderWidth: 1,
    borderColor: colors.primaryLight + '40',
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  invitePromptText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  invitePromptSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  // Safety halt
  safetyCard: {
    backgroundColor: colors.safetyHalt + '10',
    borderWidth: 1,
    borderColor: colors.safetyHalt,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.lg,
    alignItems: 'center',
  },
  safetyTitle: {
    ...typography.h3,
    color: colors.safetyHalt,
    marginBottom: spacing.sm,
  },
  safetyText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  crisisButton: {
    backgroundColor: colors.safetyHalt,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius?.lg ?? 12,
  },
  crisisButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
});
