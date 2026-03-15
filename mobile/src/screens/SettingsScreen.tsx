/**
 * Settings Screen
 *
 * Follows app-store-certifier mandates:
 * 1. UGC Compliance: block/report abuse mechanisms
 * 2. Privacy Labels: clear data collection disclosure
 * 3. Subscription Transparency: clear premium terms
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { clearAllData } from '../services/secure-storage';

interface SettingsScreenProps {
  userId: string;
  onLogout: () => void;
}

export function SettingsScreen({ userId, onLogout }: SettingsScreenProps) {
  const handleDeleteData = () => {
    Alert.alert(
      'Delete all data?',
      'This will permanently erase your private journal, profile, and all local data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            onLogout();
          },
        },
      ],
    );
  };

  const handleReportAbuse = () => {
    // app-store-certifier mandate #1: UGC Compliance — block/report
    Alert.alert(
      'Report abuse',
      'If you feel unsafe, please contact the National DV Hotline at 1-800-799-7233 or report an issue to our safety team.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Hotline', onPress: () => Linking.openURL('tel:18007997233') },
        { text: 'Email Report', onPress: () => Linking.openURL('mailto:safety@relio.app') },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>User ID</Text>
          <Text style={styles.cardValue}>{userId}</Text>
        </View>
      </View>

      {/* Partner invite */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partner</Text>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionTitle}>Invite Partner</Text>
          <Text style={styles.actionDesc}>Share a link to invite your partner to Relio</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy — app-store-certifier mandate #2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Data stored on device</Text>
          <Text style={styles.cardValue}>
            Journal entries, profile data. Encrypted via device Secure Enclave / Keystore.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Data sent to servers</Text>
          <Text style={styles.cardValue}>
            Message text is sent for AI processing only. Raw Tier 1 messages are not stored on our servers.
          </Text>
        </View>
        <TouchableOpacity style={styles.destructiveCard} onPress={handleDeleteData}>
          <Text style={styles.destructiveText}>Delete All My Data</Text>
        </TouchableOpacity>
      </View>

      {/* Safety — app-store-certifier mandate #1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety</Text>
        <TouchableOpacity style={styles.actionCard} onPress={handleReportAbuse}>
          <Text style={[styles.actionTitle, { color: colors.safetyHalt }]}>Report Abuse</Text>
          <Text style={styles.actionDesc}>
            If you or someone you know is in danger
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardLabel}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardLabel}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
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
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  cardLabel: {
    ...typography.label,
    color: colors.text,
  },
  cardValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  actionTitle: {
    ...typography.label,
    color: colors.primary,
  },
  actionDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  destructiveCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.safetyHalt,
  },
  destructiveText: {
    ...typography.label,
    color: colors.safetyHalt,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
