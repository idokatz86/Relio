/**
 * Relio — AI Relationship Mediation App
 *
 * Entry point for iOS & Android (React Native / Expo).
 * Complete navigation flow: biometric → login → consent → ageVerify → onboarding → main app
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
import { LoginScreen } from './src/screens/LoginScreen';
import { ConsentScreen } from './src/screens/ConsentScreen';
import { AgeVerifyScreen } from './src/screens/AgeVerifyScreen';
import { LanguagePickerScreen } from './src/screens/LanguagePickerScreen';
import { PsychoeducationCards } from './src/screens/PsychoeducationCards';
import { PrivacyExplainerScreen } from './src/screens/PrivacyExplainerScreen';
import { AttachmentQuizScreen } from './src/screens/AttachmentQuizScreen';
import { InvitePartnerScreen } from './src/screens/InvitePartnerScreen';
import { AcceptInviteScreen } from './src/screens/AcceptInviteScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { getProfile, isBiometricAvailable } from './src/services/secure-storage';
import { isAuthenticated, clearTokens, storeTokens } from './src/services/token-manager';
import { initSentry, captureScreenTransition } from './src/services/sentry';
import { initSubscriptions, type SubscriptionTier } from './src/services/subscriptions';
import { colors } from './src/theme';
import type { UserProfile } from './src/types';

type AppScreen =
  | 'biometric'
  | 'login'
  | 'consent'
  | 'ageVerify'
  | 'onboarding'
  | 'privacyExplainer'
  | 'attachmentQuiz'
  | 'psychoeducation'
  | 'chat'
  | 'journal'
  | 'crisis'
  | 'settings'
  | 'languagePicker'
  | 'invitePartner'
  | 'acceptInvite'
  | 'paywall';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('biometric');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [crisisSeverity, setCrisisSeverity] = useState('HIGH');
  const [hasConsented, setHasConsented] = useState(false);
  const [hasVerifiedAge, setHasVerifiedAge] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');

  useEffect(() => {
    initSentry();
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const hasBiometric = await isBiometricAvailable();
      if (!hasBiometric) {
        await checkAuth();
        return;
      }
      setScreen('biometric');
    } catch (e) {
      console.log('[App] Biometric check failed, skipping:', e);
      await checkAuth();
    }
  };

  const checkAuth = async () => {
    const authed = await isAuthenticated();
    if (!authed) {
      setScreen('login');
      return;
    }
    await checkProfile();
  };

  const checkProfile = async () => {
    const stored = await getProfile();
    if (stored) {
      setProfile(stored);
      setScreen('chat');
    } else {
      setScreen('consent');
    }
  };

  // ── Auth Handlers ──────────────────────────────────────

  const handleBiometricSuccess = useCallback(async () => {
    await checkAuth();
  }, []);

  const handleLoginSuccess = useCallback(async (token: string, userId: string) => {
    await storeTokens({
      accessToken: token,
      expiresAt: Date.now() + 3600000, // 1 hour
      userId,
    });
    // Check if user has already completed onboarding
    const stored = await getProfile();
    if (stored) {
      setProfile(stored);
      setScreen('chat');
    } else {
      setScreen('consent');
    }
  }, []);

  const handleConsentComplete = useCallback(() => {
    setHasConsented(true);
    setScreen('ageVerify');
  }, []);

  const handleAgeVerified = useCallback(() => {
    setHasVerifiedAge(true);
    setScreen('privacyExplainer');
  }, []);

  const handlePrivacyExplainerDone = useCallback(() => {
    setScreen('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setScreen('psychoeducation');
  }, []);

  const handlePsychoeducationDone = useCallback(() => {
    setScreen('attachmentQuiz');
  }, []);

  const handleQuizComplete = useCallback(() => {
    setScreen('paywall');
  }, []);

  const handleSubscribed = useCallback((tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    setScreen('chat');
  }, []);

  const handleSkipPaywall = useCallback(() => {
    setSubscriptionTier('free');
    setScreen('chat');
  }, []);

  // ── Main App Handlers ──────────────────────────────────

  const handleSafetyHalt = useCallback((severity: string) => {
    setCrisisSeverity(severity);
    setScreen('crisis');
  }, []);

  const handleCrisisAcknowledge = useCallback(() => {
    setScreen('chat');
  }, []);

  const handleLogout = useCallback(async () => {
    await clearTokens();
    setProfile(null);
    setHasConsented(false);
    setHasVerifiedAge(false);
    setScreen('login');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {screen === 'biometric' && (
        <BiometricLockScreen onAuthenticated={handleBiometricSuccess} />
      )}

      {screen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSignUp={() => setScreen('login')}
        />
      )}

      {screen === 'consent' && (
        <ConsentScreen
          onAccept={handleConsentComplete}
          tosVersion="1.0.0"
          privacyVersion="1.0.0"
        />
      )}

      {screen === 'ageVerify' && (
        <AgeVerifyScreen
          onVerified={handleAgeVerified}
          onUnderage={() => setScreen('login')}
        />
      )}

      {screen === 'privacyExplainer' && (
        <PrivacyExplainerScreen onComplete={handlePrivacyExplainerDone} />
      )}

      {screen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {screen === 'psychoeducation' && (
        <PsychoeducationCards
          onComplete={handlePsychoeducationDone}
          onSkip={handlePsychoeducationDone}
        />
      )}

      {screen === 'attachmentQuiz' && (
        <AttachmentQuizScreen
          onComplete={() => setScreen('chat')}
          onSkip={() => setScreen('chat')}
        />
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
        <SettingsScreen
          userId={profile.userId}
          onLogout={handleLogout}
        />
      )}

      {screen === 'languagePicker' && (
        <LanguagePickerScreen
          currentLanguage="en"
          onSelect={() => setScreen('settings')}
        />
      )}

      {screen === 'invitePartner' && profile && (
        <InvitePartnerScreen
          userId={profile.userId}
          onBack={() => setScreen('chat')}
          onPartnerJoined={() => setScreen('chat')}
        />
      )}

      {screen === 'acceptInvite' && (
        <AcceptInviteScreen
          onBack={() => setScreen('invitePartner')}
          onPaired={() => setScreen('chat')}
        />
      )}

      {screen === 'paywall' && (
        <PaywallScreen
          onSubscribed={handleSubscribed}
          onSkip={handleSkipPaywall}
          onRestore={handleSkipPaywall}
        />
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
