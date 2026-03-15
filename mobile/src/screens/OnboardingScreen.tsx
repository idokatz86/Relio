/**
 * Onboarding Screen
 *
 * First experience for new users. Collects relationship stage,
 * sets up profile, and explains the 3-Tier Confidentiality Model.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import { saveProfile } from '../services/secure-storage';
import type { UserProfile } from '../types';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

type Step = 'welcome' | 'privacy' | 'stage';

const STAGES = [
  { id: 'dating', label: 'Dating (0-6 months)', emoji: '💫' },
  { id: 'committed', label: 'Committed (6-18 months)', emoji: '💞' },
  { id: 'long-term', label: 'Long-term (18+ months)', emoji: '💕' },
  { id: 'engaged', label: 'Engaged / Married', emoji: '💍' },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [stage, setStage] = useState<string | null>(null);

  const handleFinish = async () => {
    const profile: UserProfile = {
      userId: `user-${Date.now()}`,
      displayName: 'You',
    };
    await saveProfile(profile);
    onComplete(profile);
  };

  if (step === 'welcome') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.logo}>Relio</Text>
        <Text style={styles.tagline}>AI-powered relationship mediation</Text>

        <View style={styles.featureList}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🛡️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Your words are private</Text>
              <Text style={styles.featureDesc}>
                What you say is never shared directly with your partner.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI transforms your message</Text>
              <Text style={styles.featureDesc}>
                Relio converts raw feelings into constructive questions.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>💬</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Partner sees the best version</Text>
              <Text style={styles.featureDesc}>
                Your partner receives an empathetic, Socratic question instead.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('privacy')}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (step === 'privacy') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.stepTitle}>Your privacy matters</Text>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyTierLabel}>Tier 1 — Private</Text>
          <Text style={styles.privacyTierDesc}>
            Your raw feelings stay encrypted on YOUR device only.
            Not even Relio servers store your original words.
          </Text>
        </View>

        <View style={[styles.privacyCard, styles.privacyCardShared]}>
          <Text style={styles.privacyTierLabel}>Tier 3 — Shared</Text>
          <Text style={styles.privacyTierDesc}>
            Only the AI-transformed, empathetic version reaches your partner.
            Names, accusations, and raw language are stripped.
          </Text>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            🔒 All local data is encrypted using your device's secure hardware
            (Face ID / Touch ID / Biometric).
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('stage')}>
          <Text style={styles.primaryButtonText}>I understand — Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // step === 'stage'
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.stepTitle}>What stage is your relationship?</Text>
      <Text style={styles.stepSubtitle}>This helps Relio personalize guidance</Text>

      {STAGES.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.stageOption, stage === s.id && styles.stageOptionSelected]}
          onPress={() => setStage(s.id)}
        >
          <Text style={styles.stageEmoji}>{s.emoji}</Text>
          <Text style={[styles.stageLabel, stage === s.id && styles.stageLabelSelected]}>
            {s.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.primaryButton, !stage && styles.primaryButtonDisabled]}
        onPress={handleFinish}
        disabled={!stage}
      >
        <Text style={styles.primaryButtonText}>Start using Relio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl * 1.5,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  featureList: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  stepTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  privacyCard: {
    backgroundColor: colors.tier1Private,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.tier1PrivateBorder,
  },
  privacyCardShared: {
    backgroundColor: colors.tier3Shared,
    borderColor: colors.tier3SharedBorder,
  },
  privacyTierLabel: {
    ...typography.label,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  privacyTierDesc: {
    ...typography.body,
    color: colors.text,
  },
  privacyNote: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  privacyNoteText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  stageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  stageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tier3Shared,
  },
  stageEmoji: {
    fontSize: 28,
  },
  stageLabel: {
    ...typography.body,
    color: colors.text,
  },
  stageLabelSelected: {
    ...typography.label,
    color: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  primaryButtonText: {
    ...typography.label,
    color: colors.white,
    fontSize: 16,
  },
});
