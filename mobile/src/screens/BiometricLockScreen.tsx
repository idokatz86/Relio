/**
 * Biometric Lock Screen
 *
 * Follows native-mobile-developer mandate #2: Biometric Gating
 * - Mandatory FaceID/TouchID check before allowing app access
 * - Prevents shoulder-surfing or forced device access by abusive partner
 *
 * Follows implement-local-encryption skill Step 2.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import { authenticateWithBiometrics } from '../services/secure-storage';

interface BiometricLockScreenProps {
  onAuthenticated: () => void;
}

export function BiometricLockScreen({ onAuthenticated }: BiometricLockScreenProps) {
  useEffect(() => {
    // Auto-prompt biometric on mount
    attemptAuth();
  }, []);

  const attemptAuth = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      onAuthenticated();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Relio</Text>
      <Text style={styles.lockIcon}>🔐</Text>
      <Text style={styles.title}>Locked for your safety</Text>
      <Text style={styles.subtitle}>
        Verify your identity to access your private conversations
      </Text>

      <TouchableOpacity style={styles.unlockButton} onPress={attemptAuth}>
        <Text style={styles.unlockButtonText}>Unlock with Face ID / Touch ID</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  lockIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  unlockButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  unlockButtonText: {
    ...typography.label,
    color: colors.white,
    fontSize: 16,
  },
});
