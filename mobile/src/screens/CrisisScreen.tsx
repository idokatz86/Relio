/**
 * Crisis Screen
 *
 * Triggered when Safety Guardian issues a HALT.
 * Follows ui-ux-expert mandate #2: designed as a calm, authoritative full-screen takeover.
 * This screen is NON-DISMISSABLE — the user must explicitly acknowledge before continuing.
 *
 * Follows app-store-certifier mandate #1: UGC compliance (block/report abuse mechanisms).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

interface CrisisScreenProps {
  severity: string;
  onAcknowledge: () => void;
}

const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Call or text 988 — free, 24/7 support',
    phone: '988',
    url: 'tel:988',
  },
  {
    name: 'National DV Hotline',
    description: 'Call 1-800-799-7233 or text START to 88788',
    phone: '1-800-799-7233',
    url: 'tel:18007997233',
  },
  {
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741',
    phone: '741741',
    url: 'sms:741741&body=HOME',
  },
];

export function CrisisScreen({ severity, onAcknowledge }: CrisisScreenProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCall = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🛡️</Text>
        </View>

        <Text style={styles.title}>We're here for you</Text>

        <Text style={styles.message}>
          Relio detected something that suggests you or someone you know
          may need support beyond what our AI can provide.
        </Text>

        <Text style={styles.subtitle}>
          You're not alone. Please reach out to one of these resources:
        </Text>

        {/* Crisis resources */}
        {CRISIS_RESOURCES.map((resource) => (
          <TouchableOpacity
            key={resource.name}
            style={styles.resourceCard}
            onPress={() => handleCall(resource.url)}
          >
            <Text style={styles.resourceName}>{resource.name}</Text>
            <Text style={styles.resourceDesc}>{resource.description}</Text>
            <Text style={styles.resourceAction}>Tap to connect →</Text>
          </TouchableOpacity>
        ))}

        {/* Non-dismissable: must check acknowledgment first */}
        <View style={styles.acknowledgmentSection}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcknowledged(!acknowledged)}
          >
            <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
              {acknowledged && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I have reviewed these resources and feel safe to continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, !acknowledged && styles.continueButtonDisabled]}
            onPress={onAcknowledge}
            disabled={!acknowledged}
          >
            <Text style={styles.continueButtonText}>Return to app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  subtitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resourceCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.safetyHalt,
  },
  resourceName: {
    ...typography.h3,
    color: colors.safetyHalt,
    marginBottom: spacing.xs,
  },
  resourceDesc: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resourceAction: {
    ...typography.label,
    color: colors.safetyHalt,
  },
  acknowledgmentSection: {
    marginTop: spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  continueButtonText: {
    ...typography.label,
    color: colors.white,
  },
});
