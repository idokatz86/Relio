/**
 * Relio — AI Relationship Mediation App
 *
 * Entry point for iOS & Android (React Native / Expo).
 *
 * Architecture governed by 6 Relio repo agents:
 * - native-mobile-developer: encryption + biometric gating
 * - ui-ux-expert: Tier 1/Tier 3 visual demarcation
 * - backend-developer: WebSocket + intercept/hold
 * - app-store-certifier: UGC compliance, privacy labels
 * - mobile-qa: state sync, latency resilience
 * - chief-technology-officer: dual-context DB, strict siloing
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import {
  OnboardingScreen,
  SharedChatScreen,
  PrivateJournalScreen,
  CrisisScreen,
  BiometricLockScreen,
  SettingsScreen,
} from './src/screens';
import { getProfile, isBiometricAvailable } from './src/services/secure-storage';
import { colors } from './src/theme';
import type { UserProfile } from './src/types';

type AppScreen = 'biometric' | 'onboarding' | 'chat' | 'journal' | 'crisis' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('biometric');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [crisisSeverity, setCrisisSeverity] = useState('HIGH');

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    // Check biometric availability
    const hasBiometric = await isBiometricAvailable();
    if (!hasBiometric) {
      // Skip biometric if not available (dev/simulator)
      await checkProfile();
      return;
    }
    setScreen('biometric');
  };

  const checkProfile = async () => {
    const stored = await getProfile();
    if (stored) {
      setProfile(stored);
      setScreen('chat');
    } else {
      setScreen('onboarding');
    }
  };

  const handleBiometricSuccess = useCallback(async () => {
    await checkProfile();
  }, []);

  const handleOnboardingComplete = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setScreen('chat');
  }, []);

  const handleSafetyHalt = useCallback((severity: string) => {
    setCrisisSeverity(severity);
    setScreen('crisis');
  }, []);

  const handleCrisisAcknowledge = useCallback(() => {
    setScreen('chat');
  }, []);

  const handleLogout = useCallback(() => {
    setProfile(null);
    setScreen('onboarding');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {screen === 'biometric' && (
        <BiometricLockScreen onAuthenticated={handleBiometricSuccess} />
      )}

      {screen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {screen === 'chat' && profile && (
        <SharedChatScreen
          userId={profile.userId}
          onSafetyHalt={handleSafetyHalt}
          onOpenJournal={() => setScreen('journal')}
        />
      )}

      {screen === 'journal' && (
        <PrivateJournalScreen onBack={() => setScreen('chat')} />
      )}

      {screen === 'crisis' && (
        <CrisisScreen severity={crisisSeverity} onAcknowledge={handleCrisisAcknowledge} />
      )}

      {screen === 'settings' && profile && (
        <SettingsScreen userId={profile.userId} onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
