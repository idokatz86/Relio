/**
 * Secure Storage Service
 *
 * Follows native-mobile-developer agent mandates:
 * 1. At-Rest Encryption: iOS Secure Enclave / Android Keystore via expo-secure-store
 * 2. Biometric Gating: FaceID/TouchID check before app access
 *
 * Follows implement-local-encryption skill steps.
 */

import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import type { UserProfile, JournalEntry } from '../types';

const KEYS = {
  USER_PROFILE: 'relio_user_profile',
  JOURNAL_ENTRIES: 'relio_journal',
  AUTH_TOKEN: 'relio_auth_token',
  BIOMETRIC_ENABLED: 'relio_biometric_enabled',
  PREFERRED_LANGUAGE: 'relio_preferred_language',
} as const;

// ── Step 1: Secure Storage (iOS Keychain/Secure Enclave, Android Keystore) ──

export async function saveProfile(profile: UserProfile): Promise<void> {
  await SecureStore.setItemAsync(
    KEYS.USER_PROFILE,
    JSON.stringify(profile),
  );
}

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await SecureStore.getItemAsync(KEYS.USER_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const entries = await getJournalEntries();
  entries.unshift(entry);
  // Keep last 500 entries
  const trimmed = entries.slice(0, 500);
  await SecureStore.setItemAsync(
    KEYS.JOURNAL_ENTRIES,
    JSON.stringify(trimmed),
  );
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const raw = await SecureStore.getItemAsync(KEYS.JOURNAL_ENTRIES);
  return raw ? JSON.parse(raw) : [];
}

export async function clearAllData(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.USER_PROFILE);
  await SecureStore.deleteItemAsync(KEYS.JOURNAL_ENTRIES);
  await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.BIOMETRIC_ENABLED);
  await SecureStore.deleteItemAsync(KEYS.PREFERRED_LANGUAGE);
}

// ── Step 2: Biometric Gate (FaceID/TouchID on iOS, BiometricPrompt on Android) ──

export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Verify your identity to access Relio',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
    fallbackLabel: 'Use passcode',
  });
  return result.success;
}

// ── Issue #127: Configurable Biometric Gate ──────────────────

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
}

export async function isBiometricEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
  // Default: enabled if biometric hardware is available
  if (value === null) {
    return isBiometricAvailable();
  }
  return value === 'true';
}

// ── Issue #139: Preferred Language Storage ───────────────────

export async function setPreferredLanguage(lang: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.PREFERRED_LANGUAGE, lang);
}

export async function getPreferredLanguage(): Promise<string> {
  const value = await SecureStore.getItemAsync(KEYS.PREFERRED_LANGUAGE);
  return value || 'en';
}
